import React, { useState, useCallback } from "react";
import {
  Shield,
  Upload,
  Zap,
  CheckCircle,
  AlertTriangle,
  Github,
  Loader2,
  Lock,
  BarChart,
  Eye,
} from "lucide-react";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    isDeepfake: boolean;
    confidence: number;
  } | null>(null);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (
      droppedFile &&
      (droppedFile.type.startsWith("image/") ||
        droppedFile.type.startsWith("video/"))
    ) {
      handleFile(droppedFile);
    }
  }, []);

  const handleFile = (file: File) => {
    setFile(file);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith("video/")) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setResult(result);
    } catch (error) {
      console.error("Error analyzing file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to determine result status
  const getResultStatus = (result: {
    isDeepfake: boolean;
    confidence: number;
  }) => {
    if (result.confidence >= 60) {
      return result.isDeepfake ? "deepfake" : "authentic";
    } else if (result.confidence >= 20) {
      return "uncertain";
    } else {
      return "low-confidence";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/2 w-80 h-80 bg-cyan-500 rounded-full opacity-10 blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <header className="relative container mx-auto px-6 py-8 md:py-16">
        <nav className="flex flex-col md:flex-row justify-between items-center mb-16">
          <div className="flex items-center space-x-2 mb-6 md:mb-0">
            <Shield className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
              DeepGuard
            </span>
          </div>
          <div className="flex space-x-8">
            <a
              href="#features"
              className="hover:text-blue-400 transition-colors text-sm md:text-base font-medium"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-blue-400 transition-colors text-sm md:text-base font-medium"
            >
              How it Works
            </a>
            <a
              href="#demo"
              className="hover:text-blue-400 transition-colors text-sm md:text-base font-medium"
            >
              Demo
            </a>
            <a
              href="#"
              className="bg-blue-500/20 hover:bg-blue-500/30 px-4 py-2 rounded-full text-blue-300 transition-colors text-sm md:text-base font-medium"
            >
              Sign Up
            </a>
          </div>
        </nav>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2 relative z-10">
            <div className="absolute -left-6 -top-6 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Detect{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                Deepfakes
              </span>{" "}
              with AI-Powered Precision
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
              In a world of digital deception, DeepGuard stands as your shield.
              Our advanced AI technology detects manipulated media with
              unparalleled accuracy, giving you confidence in what's real.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a
                href="#demo"
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 px-8 py-4 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/20 text-center"
              >
                Try Demo
              </a>
              <button className="border border-blue-400/30 bg-blue-500/10 hover:bg-blue-500/20 px-8 py-4 rounded-xl font-semibold transition-all text-blue-300 hover:text-blue-200">
                Learn More
              </button>
            </div>

            <div className="mt-12 flex items-center space-x-6">
              <div className="flex -space-x-2">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64&q=80"
                  className="w-10 h-10 rounded-full border-2 border-indigo-900"
                  alt="User"
                />
                <img
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64&q=80"
                  className="w-10 h-10 rounded-full border-2 border-indigo-900"
                  alt="User"
                />
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64&q=80"
                  className="w-10 h-10 rounded-full border-2 border-indigo-900"
                  alt="User"
                />
              </div>
              <div className="text-sm text-gray-400">
                <span className="text-blue-400 font-medium">2,500+</span>{" "}
                professionals trust DeepGuard
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl -z-10 transform rotate-3"></div>
            <img
              src="https://images.unsplash.com/photo-1633412802994-5c058f151b66?auto=format&fit=crop&w=800&q=80"
              alt="AI Technology Visualization"
              className="rounded-2xl shadow-2xl border border-gray-800/50 transform hover:-translate-y-2 transition-transform duration-300"
            />
            <div className="absolute -right-4 -bottom-4 bg-gradient-to-r from-blue-500 to-cyan-400 p-4 rounded-lg shadow-xl">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-white" />
                <span className="text-white font-medium">99.9% Accuracy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-blue-500/30 transition-colors">
            <div className="text-blue-400 font-bold text-4xl mb-2">99.9%</div>
            <div className="text-gray-400">Detection Accuracy</div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-blue-500/30 transition-colors">
            <div className="text-blue-400 font-bold text-4xl mb-2">2.5M+</div>
            <div className="text-gray-400">Media Files Analyzed</div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-blue-500/30 transition-colors">
            <div className="text-blue-400 font-bold text-4xl mb-2">500+</div>
            <div className="text-gray-400">Enterprise Clients</div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="relative py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium mb-4">
              POWERFUL FEATURES
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose DeepGuard?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our platform combines cutting-edge AI with intuitive design to
              provide the most reliable deepfake detection available.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="w-12 h-12 text-blue-400" />}
              title="Real-Time Detection"
              description="Get instant results with our lightning-fast detection engine powered by state-of-the-art neural networks."
              gradient="from-blue-500/20 to-cyan-500/20"
            />
            <FeatureCard
              icon={<CheckCircle className="w-12 h-12 text-green-400" />}
              title="99.9% Accuracy"
              description="Industry-leading precision in detecting manipulated media across images, videos, and audio content."
              gradient="from-green-500/20 to-emerald-500/20"
            />
            <FeatureCard
              icon={<AlertTriangle className="w-12 h-12 text-amber-400" />}
              title="Early Warning System"
              description="Proactive alerts for potential deepfake threats before they can cause harm to your reputation."
              gradient="from-amber-500/20 to-orange-500/20"
            />
            <FeatureCard
              icon={<Lock className="w-12 h-12 text-purple-400" />}
              title="Enterprise Security"
              description="Bank-level encryption and privacy controls ensure your sensitive media remains protected."
              gradient="from-purple-500/20 to-indigo-500/20"
            />
            <FeatureCard
              icon={<BarChart className="w-12 h-12 text-pink-400" />}
              title="Detailed Analytics"
              description="Comprehensive reports with visual breakdowns of detection results and confidence metrics."
              gradient="from-pink-500/20 to-rose-500/20"
            />
            <FeatureCard
              icon={<Eye className="w-12 h-12 text-teal-400" />}
              title="Visual Heatmaps"
              description="See exactly which parts of an image or video have been manipulated with our visual highlighting tool."
              gradient="from-teal-500/20 to-cyan-500/20"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="relative py-24 bg-gradient-to-b from-transparent to-gray-900/50"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium mb-4">
              THE PROCESS
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How DeepGuard Works
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our advanced AI system analyzes multiple layers of media to detect
              even the most sophisticated deepfakes.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <ProcessCard
              number="01"
              title="Upload Media"
              description="Simply upload any image or video file you want to analyze."
              color="blue"
            />
            <ProcessCard
              number="02"
              title="AI Analysis"
              description="Our neural networks scan for inconsistencies invisible to the human eye."
              color="purple"
            />
            <ProcessCard
              number="03"
              title="Detailed Report"
              description="Receive a comprehensive analysis with confidence scores."
              color="pink"
            />
            <ProcessCard
              number="04"
              title="Take Action"
              description="Use our findings to make informed decisions about the content."
              color="cyan"
            />
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="relative py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-medium mb-4">
              LIVE DEMO
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Try It Yourself
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Upload your own media file and see our deepfake detection
              technology in action.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all backdrop-blur-sm ${
                isDragging
                  ? "border-blue-400 bg-blue-400/10 shadow-lg shadow-blue-500/20"
                  : "border-gray-700 hover:border-blue-500/50 hover:bg-blue-500/5"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              {!file && (
                <>
                  <Upload className="w-16 h-16 text-blue-400 mx-auto mb-6 animate-pulse" />
                  <p className="text-xl mb-4 font-medium">
                    Drag and drop your media file here
                  </p>
                  <p className="text-gray-400 mb-8">
                    Supported formats: JPG, PNG, MP4
                  </p>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept="image/*,video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFile(file);
                    }}
                  />
                  <label
                    htmlFor="file-upload"
                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 px-8 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/20 cursor-pointer inline-block"
                  >
                    Browse Files
                  </label>
                </>
              )}

              {file && (
                <div className="space-y-8">
                  <div className="max-w-lg mx-auto relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                    <div className="relative bg-gray-900 rounded-lg p-2">
                      {file.type.startsWith("image/") && (
                        <img
                          src={preview!}
                          alt="Preview"
                          className="rounded-lg shadow-lg max-h-[400px] mx-auto"
                        />
                      )}
                      {file.type.startsWith("video/") && (
                        <video
                          src={preview!}
                          controls
                          className="rounded-lg shadow-lg max-h-[400px] mx-auto"
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button
                      onClick={handleAnalyze}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 px-8 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading && (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      )}
                      {isLoading ? "Analyzing..." : "Analyze Now"}
                    </button>
                    <button
                      onClick={() => {
                        setFile(null);
                        setPreview(null);
                        setResult(null);
                      }}
                      className="border border-gray-600 hover:border-blue-400 px-8 py-3 rounded-xl font-semibold transition-colors bg-gray-800/50 hover:bg-gray-700/50"
                    >
                      Clear
                    </button>
                  </div>

                  {result && (
                    <div
                      className={`mt-6 p-8 rounded-xl backdrop-blur-md transition-all transform animate-fadeIn ${
                        result.isDeepfake && result.confidence >= 60
                          ? "bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30"
                          : result.confidence >= 20 && result.confidence < 60
                          ? "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30"
                          : "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold">
                          {result.isDeepfake && result.confidence >= 60
                            ? "Deepfake Detected!"
                            : result.confidence >= 20 && result.confidence < 60
                            ? "Uncertain Content - Cannot Be Trusted"
                            : "Authentic Media"}
                        </h3>
                        {result.isDeepfake && result.confidence >= 60 ? (
                          <AlertTriangle className="w-8 h-8 text-red-400" />
                        ) : result.confidence >= 20 &&
                          result.confidence < 60 ? (
                          <AlertTriangle className="w-8 h-8 text-amber-400" />
                        ) : (
                          <CheckCircle className="w-8 h-8 text-green-400" />
                        )}
                      </div>

                      <div className="bg-black/20 rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-300">
                            Confidence Score:
                          </span>
                          <span
                            className={`font-bold ${
                              result.isDeepfake && result.confidence >= 60
                                ? "text-red-400"
                                : result.confidence >= 20 &&
                                  result.confidence < 60
                                ? "text-amber-400"
                                : "text-green-400"
                            }`}
                          >
                            {result.confidence.toFixed(2)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${
                              result.isDeepfake && result.confidence >= 60
                                ? "bg-red-500"
                                : result.confidence >= 20 &&
                                  result.confidence < 60
                                ? "bg-amber-500"
                                : "bg-green-500"
                            }`}
                            style={{ width: `${result.confidence}%` }}
                          ></div>
                        </div>
                      </div>

                      <p className="text-gray-300">
                        {result.isDeepfake && result.confidence >= 60
                          ? "Our AI has detected clear signs of manipulation in this media. Exercise extreme caution before sharing or trusting this content."
                          : result.confidence >= 20 && result.confidence < 60
                          ? "Our analysis shows uncertain results. This content cannot be fully trusted and should be treated with caution until verified through other means."
                          : "Our analysis indicates this media is authentic with high confidence. No signs of manipulation were detected."}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-24 bg-gradient-to-b from-transparent to-gray-900/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-sm font-medium mb-4">
              TESTIMONIALS
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Professionals
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              See what our clients have to say about DeepGuard's deepfake
              detection technology.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="DeepGuard has become an essential tool in our content verification process. It's saved us from publishing manipulated media multiple times."
              author="Sarah Johnson"
              role="Chief Editor, Global News Network"
              image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80"
            />
            <TestimonialCard
              quote="The accuracy is impressive. We've tested it against some of the most sophisticated deepfakes, and it caught them all with remarkable precision."
              author="Michael Chen"
              role="Cybersecurity Director, TechSecure"
              image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"
            />
            <TestimonialCard
              quote="As a public figure, I'm constantly at risk of deepfakes. DeepGuard gives me peace of mind by quickly verifying any suspicious content."
              author="Elena Rodriguez"
              role="Brand Protection Manager, Celebrity Inc."
              image="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24">
        <div className="container mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="absolute inset-0 overflow-hidden opacity-20">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full"></div>
              <div className="absolute top-1/3 -left-20 w-60 h-60 bg-white rounded-full"></div>
              <div className="absolute -bottom-40 left-1/2 w-80 h-80 bg-white rounded-full"></div>
            </div>

            <div className="relative p-12 md:p-16 flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-2/3 mb-8 md:mb-0">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                  Ready to protect your digital integrity?
                </h2>
                <p className="text-blue-100 text-lg mb-0 md:pr-12">
                  Join thousands of professionals who trust DeepGuard for
                  reliable deepfake detection.
                </p>
              </div>
              <div>
                <a
                  href="#"
                  className="inline-block bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold transition-colors shadow-lg"
                >
                  Get Started Free
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-16 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Shield className="w-8 h-8 text-blue-400" />
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                  DeepGuard
                </span>
              </div>
              <p className="text-gray-400 mb-6">
                Advanced AI-powered deepfake detection for professionals and
                organizations.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a
                  href="https://github.com"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <Github className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Product</h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    API
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Integration
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Company</h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Press
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Legal</h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    GDPR
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 mb-4 md:mb-0">
              © 2025 DeepGuard. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-500 hover:text-blue-400 transition-colors text-sm"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-blue-400 transition-colors text-sm"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-blue-400 transition-colors text-sm"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} p-px rounded-2xl group hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300`}
    >
      <div className="bg-gray-900 p-8 rounded-2xl h-full flex flex-col">
        <div className="mb-6 p-3 bg-gray-800/50 rounded-xl w-fit group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-4 group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
          {description}
        </p>
      </div>
    </div>
  );
}

function ProcessCard({
  number,
  title,
  description,
  color,
}: {
  number: string;
  title: string;
  description: string;
  color: string;
}) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
    pink: "from-pink-500 to-pink-600",
    cyan: "from-cyan-500 to-cyan-600",
  };

  return (
    <div className="relative">
      <div
        className={`absolute -left-4 -top-4 w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-br ${
          colorClasses[color as keyof typeof colorClasses]
        } text-white font-bold shadow-lg`}
      >
        {number}
      </div>
      <div className="bg-gray-800/50 backdrop-blur-sm p-8 pt-12 rounded-2xl border border-gray-700 hover:border-blue-500/30 transition-colors">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );
}

function TestimonialCard({
  quote,
  author,
  role,
  image,
}: {
  quote: string;
  author: string;
  role: string;
  image: string;
}) {
  return (
    <div className="bg-gray-800/30 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-blue-500/30 transition-colors">
      <div className="mb-6">
        <svg
          className="w-8 h-8 text-blue-400"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>
      <p className="text-gray-300 mb-6 italic">{quote}</p>
      <div className="flex items-center">
        <img src={image} alt={author} className="w-12 h-12 rounded-full mr-4" />
        <div>
          <h4 className="font-semibold">{author}</h4>
          <p className="text-gray-400 text-sm">{role}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
