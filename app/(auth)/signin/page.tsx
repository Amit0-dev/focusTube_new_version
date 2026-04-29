import CardInfo from '@/components/common/CardInfo';
import Container from '@/components/common/Container';
import SigninForm from '@/components/signin/page';

const Signin = () => {
  return (
    <div className="w-full h-screen">
      <Container className="w-full h-screen">
        <div className="flex items-center justify-between w-full h-full ">
          {/* LEFT SIDE */}
          <CardInfo />
          {/* RIGHT SIDE */}
          <SigninForm />
        </div>
      </Container>
    </div>
  );
};

export default Signin;
