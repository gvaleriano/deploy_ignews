import { query as q } from 'faunadb';

import NextAuth from 'next-auth';
import { session } from 'next-auth/client';
import Providers from 'next-auth/providers';
import { FaUmbraco } from 'react-icons/fa';

import { fauna } from '../../../services/fauna';

export default NextAuth({
  //Configure one or more authentication providers
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      scope: 'read:user'
    }),
    // ..add more providers here
  ],
  // A database is optional, but required to persist accounts in a database
  // database: process.env.DATABASE_URL,
  callbacks: {
    //permite ter acesso ao session, modificar os dados, e retornar o session 
    //com os dados modificados
    async session(session) {
      try {
        //verificar se o usuários tem uma assinatura ativa
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              //buscar uma subscription pela "ref" do usuário
              q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select(
                  "ref",
                  q.Get(
                    //buscar a "ref" do usuário pelo "email"
                    q.Match(
                      q.Index('user_by_email'),
                      q.Casefold(session.user.email)
                    )
                  )
                )
              ),
              q.Match(
                q.Index('subscription_by_status'),
                "active"
              )
            ])
          )
        )

        return {
          //retornar os dados session e a "userActiveSubscription"
          ...session,
          activeSubscription: userActiveSubscription
        }
      } catch {
        return {
          ...session,
          activeSubscription: null,
        }
      }
    },

    async signIn(user, account, profile) {
      //console.log(user)
      const { email } = user

      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(user.email)
                )
              )
            ),
            q.Create(
              q.Collection('users'),
              { data: { email } }
            ),
            q.Get(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(user.email)
              )
            )
          )
        )
        return true
      } catch {
        return false
      }
    },
  }
})