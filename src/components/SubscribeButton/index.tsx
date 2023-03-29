import { useSession, signIn } from 'next-auth/client';
import { useRouter } from 'next/router';

import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';

import styles from './styles.module.scss';

// 3 lugares onde podemos utilizar nossas credenciais secretas/;
// getServerSideProps (SSR) -só são utilizada no momento em que a página esta sendo renderizada.
// getStaticProps (SSG) - só utilizada quando a página está sendo renderizada.
// API routes - executado a partir de uma ação do usuários. ex. clique botão

export function SubscribeButton() {
  const [session] = useSession();
  const router = useRouter();

  async function handleSubscribe() {
    //Verifica se exite uma session para o usuário
    //Caso não exista, direciona o usuário para fazer login
    if (!session) {
      signIn('github')
      return;
    }

    console.log(session.activeSubscription);

    //Se já existe uma assinatura ativa, redireciona o usuário para
    //a página de posts
    if (session.activeSubscription) {
      router.push('/posts');
      return;
    }

    // criação da checkout session stripe
    try {
      const response = await api.post('/subscribe')

      const { sessionId } = response.data;

      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({ sessionId });

    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}