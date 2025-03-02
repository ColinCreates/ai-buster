"use client"; // If using Next.js; remove if pure Vite
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils"; // Adjust path if needed
import { useNavigate } from "react-router-dom";
import LearnMore from "../components/LearnMore";

// BackgroundBeamsWithCollision Component
const BackgroundBeamsWithCollision = ({ children, className }) => {
  const containerRef = React.useRef(null);
  const parentRef = React.useRef(null);

  const beams = [
    { initialX: 10, translateX: 10, duration: 7, repeatDelay: 3, delay: 2 },
    { initialX: 600, translateX: 600, duration: 3, repeatDelay: 3, delay: 4 },
    {
      initialX: 100,
      translateX: 100,
      duration: 7,
      repeatDelay: 7,
      className: "h-6",
    },
    { initialX: 400, translateX: 400, duration: 5, repeatDelay: 14, delay: 4 },
    {
      initialX: 800,
      translateX: 800,
      duration: 11,
      repeatDelay: 2,
      className: "h-20",
    },
    {
      initialX: 1000,
      translateX: 1000,
      duration: 4,
      repeatDelay: 2,
      className: "h-12",
    },
    {
      initialX: 1200,
      translateX: 1200,
      duration: 6,
      repeatDelay: 4,
      delay: 2,
      className: "h-6",
    },
  ];

  return (
    <div
      ref={parentRef}
      className={cn(
        "min-h-screen bg-gray-950 relative flex items-center w-full justify-center overflow-hidden",
        className
      )}
    >
      {beams.map((beam) => (
        <CollisionMechanism
          key={beam.initialX + "beam-idx"}
          beamOptions={beam}
          containerRef={containerRef}
          parentRef={parentRef}
        />
      ))}
      {children}
      <div
        ref={containerRef}
        className="absolute bottom-0 bg-gray-900 w-full inset-x-0 pointer-events-none"
        style={{
          boxShadow:
            "0 0 24px rgba(108, 70, 255, 0.2), 0 1px 1px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(108, 70, 255, 0.1), 0 0 4px rgba(108, 70, 255, 0.15), 0 16px 68px rgba(47, 48, 55, 0.3)",
        }}
      ></div>
    </div>
  );
};

const CollisionMechanism = React.forwardRef(
  ({ parentRef, containerRef, beamOptions = {} }, ref) => {
    const beamRef = React.useRef(null);
    const [collision, setCollision] = React.useState({
      detected: false,
      coordinates: null,
    });
    const [beamKey, setBeamKey] = React.useState(0);
    const [cycleCollisionDetected, setCycleCollisionDetected] =
      React.useState(false);

    React.useEffect(() => {
      const checkCollision = () => {
        if (
          beamRef.current &&
          containerRef.current &&
          parentRef.current &&
          !cycleCollisionDetected
        ) {
          const beamRect = beamRef.current.getBoundingClientRect();
          const containerRect = containerRef.current.getBoundingClientRect();
          const parentRect = parentRef.current.getBoundingClientRect();

          if (beamRect.bottom >= containerRect.top) {
            const relativeX =
              beamRect.left - parentRect.left + beamRect.width / 2;
            const relativeY = beamRect.bottom - parentRect.top;

            setCollision({
              detected: true,
              coordinates: { x: relativeX, y: relativeY },
            });
            setCycleCollisionDetected(true);
          }
        }
      };

      const animationInterval = setInterval(checkCollision, 50);
      return () => clearInterval(animationInterval);
    }, [cycleCollisionDetected, containerRef]);

    React.useEffect(() => {
      if (collision.detected && collision.coordinates) {
        setTimeout(() => {
          setCollision({ detected: false, coordinates: null });
          setCycleCollisionDetected(false);
        }, 2000);
        setTimeout(() => setBeamKey((prevKey) => prevKey + 1), 1000);
      }
    }, [collision]);

    return (
      <>
        <motion.div
          key={beamKey}
          ref={beamRef}
          animate="animate"
          initial={{
            translateY: beamOptions.initialY || "-200px",
            translateX: beamOptions.initialX || "0px",
            rotate: beamOptions.rotate || 0,
          }}
          variants={{
            animate: {
              translateY: beamOptions.translateY || "1800px",
              translateX: beamOptions.translateX || "0px",
              rotate: beamOptions.rotate || 0,
            },
          }}
          transition={{
            duration: beamOptions.duration || 8,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            delay: beamOptions.delay || 0,
            repeatDelay: beamOptions.repeatDelay || 0,
          }}
          className={cn(
            "absolute left-0 top-20 m-auto h-14 w-px rounded-full bg-gradient-to-t from-violet-500 via-blue-500 to-transparent",
            beamOptions.className
          )}
        />
        <AnimatePresence>
          {collision.detected && collision.coordinates && (
            <Explosion
              key={`${collision.coordinates.x}-${collision.coordinates.y}`}
              className=""
              style={{
                left: `${collision.coordinates.x}px`,
                top: `${collision.coordinates.y}px`,
                transform: "translate(-50%, -50%)",
              }}
            />
          )}
        </AnimatePresence>
      </>
    );
  }
);
CollisionMechanism.displayName = "CollisionMechanism";

const Explosion = ({ ...props }) => {
  const spans = Array.from({ length: 20 }, (_, index) => ({
    id: index,
    initialX: 0,
    initialY: 0,
    directionX: Math.floor(Math.random() * 80 - 40),
    directionY: Math.floor(Math.random() * -50 - 10),
  }));

  return (
    <div {...props} className={cn("absolute z-50 h-2 w-2", props.className)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute -inset-x-10 top-0 m-auto h-2 w-10 rounded-full bg-gradient-to-r from-transparent via-violet-500 to-transparent blur-sm"
      ></motion.div>
      {spans.map((span) => (
        <motion.span
          key={span.id}
          initial={{ x: span.initialX, y: span.initialY, opacity: 1 }}
          animate={{ x: span.directionX, y: span.directionY, opacity: 0 }}
          transition={{ duration: Math.random() * 1.5 + 0.5, ease: "easeOut" }}
          className="absolute h-1 w-1 rounded-full bg-gradient-to-b from-violet-500 to-blue-500"
        />
      ))}
    </div>
  );
};

// HomePage Component
const HomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/signup");
  };

  const handleLogin = () => {
    navigate("/login");
  };
  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <BackgroundBeamsWithCollision>
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        {/* Header */}
        <header className="bg-gray-950 text-gray-200 p-4 border-b border-gray-800">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-medium">AI-Buster</h1>
            <div className="space-x-4">
              <button
                onClick={handleLogin}
                className="bg-gray-900 text-gray-300 font-medium py-2 px-4 rounded-lg border border-gray-800 hover:bg-gray-800 transition duration-300"
              >
                Login
              </button>
              <button
                onClick={handleSignup}
                className="bg-blue-950 text-gray-200 font-medium py-2 px-4 rounded-lg border border-blue-900 hover:bg-blue-900 transition duration-300"
              >
                Sign Up
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow flex items-center justify-center py-16">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-violet-300 mb-4">
              AI-Buster
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Unmask the truth behind images and videos with cutting-edge AI.
            </p>
            <div className="space-x-6">
              <button
                onClick={handleGetStarted}
                className="bg-blue-950 text-gray-200 font-medium py-3 px-6 rounded-lg border border-blue-900 hover:bg-blue-900 transition duration-300"
              >
                Get Started
              </button>
              <button className="bg-gray-900 text-violet-400 font-medium py-3 px-6 rounded-lg border border-violet-800 hover:bg-violet-950 transition duration-300">
                Learn More
              </button>
            </div>
          </div>
        </main>
        {/* Learn More Section */}
        {/* <div id="learn-more">
          <LearnMore />
        </div> */}

        {/* Footer */}
        <footer className="bg-gray-950 text-gray-400 py-4 border-t border-gray-800">
          <div className="container mx-auto text-center">
            <p>© 2025 AI-Buster. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </BackgroundBeamsWithCollision>
  );
};

export default HomePage;
