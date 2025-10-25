import React from "react";
import bgImage from "../assets/high-angle-delicious-burger-composition_23-2148868220.jpg"; 
const About = () => {
  return (
    <div
      className="relative min-h-screen bg-white/90 py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />
      <div className="relative z-10">
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-lg p-8 md:p-12 rounded-xl shadow-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-center text-amber-800 mb-6 tracking-tight">
              About Taste Maker
            </h1>
            <p className="text-lg text-gray-700 font-semibold text-center mb-10 leading-relaxed">
              Your kitchen's creative partner — turning everyday ingredients
              into delicious new possibilities.
            </p>

            <div className="space-y-8 text-gray-800">
              <section>
                <h2 className="text-2xl font-semibold text-orange-700 mb-3 border-b-2 border-orange-200 pb-2">
                  What's Cooking Here?
                </h2>
                <p className="leading-relaxed">
                  Ever looked into your fridge, full of random ingredients, and
                  still thought, “What do I even cook?” We've all been there!
                  <br />
                  That's exactly why <b>Taste Maker</b> was created — to help
                  you bridge the gap between what you <i>have</i> and what you
                  can
                  <i> make.</i>
                  <br />
                  Our goal is simple: to spark your creativity and make
                  discovering your next meal easy, fun, and exciting.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-orange-700 mb-3 border-b-2 border-orange-200 pb-2">
                  How We Help You Shine
                </h2>
                <ul className="list-disc list-outside ml-5 space-y-3 leading-relaxed">
                  <li>
                    <strong className="font-medium">
                      Search Smarter, Not Harder:
                    </strong>{" "}
                    Just tell us what ingredients you've got — maybe some
                    veggies, a bit of chicken, or a few spices — and we'll find
                    recipes that fit perfectly.
                    <br />
                    You can even filter by cuisine or preference to find what
                    you're really craving.
                  </li>
                  <li>
                    <strong className="font-medium">
                      AI-Powered Inspiration:
                    </strong>{" "}
                    Feeling bored with the same old meals? Try our AI-powered
                    recipe generator! It creates fun, creative dishes based on
                    what you have — like a friendly chef giving you new ideas.
                  </li>
                  <li>
                    <strong className="font-medium">
                      Simple, Seamless Experience:
                    </strong>{" "}
                    Taste Maker is designed to be easy and smooth to use — so
                    you can focus on cooking, not figuring out how to use the
                    app.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-orange-700 mb-3 border-b-2 border-orange-200 pb-2">
                  Our Philosophy
                </h2>
                <p className="leading-relaxed">
                  We believe cooking should be joyful, creative, and a way to
                  connect — with your ingredients, your flavors, and your loved
                  ones.
                  <br />
                  Taste Maker removes the stress of deciding what to cook, so
                  you can enjoy the process and the meal itself. Whether you're
                  an expert cook or just starting out, we're here to make your
                  kitchen time more inspiring and fun.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-orange-700 mb-3 border-b-2 border-orange-200 pb-2">
                  Behind the Scenes
                </h2>
                <p className="leading-relaxed">
                  Taste Maker is built with love for both food and technology.
                  It uses modern web tools, smart recipe APIs, and generative AI
                  to give you quick, creative ideas. It's our small effort to
                  make your cooking life easier — and a lot tastier!
                </p>
              </section>

              <p className="text-center text-lg text-amber-700 pt-6 font-medium">
                Happy Cooking!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
