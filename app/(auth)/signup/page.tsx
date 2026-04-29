import CardInfo from '@/components/common/CardInfo';
import Container from '@/components/common/Container';
import SignupForm from '@/components/signup/page';

const Signup = () => {
  return (
    <div>
      <Container className="w-full h-screen">
        <div className="flex items-center justify-between w-full h-full ">
          {/* LEFT SIDE */}

          <SignupForm />

          {/* RIGHT SIDE */}
          <CardInfo />
        </div>
      </Container>
    </div>
  );
};

export default Signup;
