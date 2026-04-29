import Container from '@/components/common/Container';
import NavBar from '@/components/navbar/page';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="w-full min-h-screen xl:px-0 md:px-5 px-5">
      <Container>
        <div className="w-full h-full">
          <NavBar />

          <div className="w-full pt-30 flex flex-col items-center justify-center">
            <h2 className="xl:text-6xl lg:text-5xl md:text-4xl text-2xl text-center font-semibold text-foreground">
              Turn YouTube Playlists into <br />{' '}
              <span className="relative inline-block capitalize">
                <span className="relative z-10">a Learning Queue</span>
                <span
                  className="absolute left-0 -bottom-1 w-full h-2 
                                bg-linear-to-r from-orange-300 via-orange-400 to-orange-500
                                opacity-80
                                rounded-sm
                                -rotate-2
                                z-0"
                ></span>
              </span>
            </h2>

            <p className="mt-6 text-gray-400 lg:text-xl md:max-w-lg md:text-lg text-sm max-w-sm lg:max-w-3xl text-center">
              A distraction-free YouTube experience with notes, progress
              tracking, and auto-cleanup.
            </p>

            {/* <Login /> */}

            <div className="lg:px-14 lg:py-16 py-10">
              <div className="relative mx-auto max-w-6xl rounded-2xl border border-white/10 bg-linear-to-b from-white/5 to-white/0 p-3 shadow-2xl backdrop-blur">
                {/* Glow effect */}
                <div className="absolute -inset-1 rounded-2xl bg-linear-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-xl opacity-60"></div>

                {/* Image wrapper */}
                <div className="relative overflow-hidden rounded-xl mask-fade-bottom">
                  <div className="absolute md:bottom-4 md:left-4 bottom-1 left-1 rounded-full bg-black/60 px-4 py-1 md:text-sm text-xs backdrop-blur">
                    Distraction-free learning
                  </div>
                  <img
                    src="https://res.cloudinary.com/amitx/image/upload/v1767867989/focusTube-image_pnviri.png"
                    alt="FocusTube product preview"
                    className="w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
