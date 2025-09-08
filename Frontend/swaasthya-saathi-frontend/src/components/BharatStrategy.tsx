import { ArrowRight, Languages, Volume2, Users } from "lucide-react";
import indiaBackground from "@/assets/india-medical-bg.jpg";

const BharatStrategy = () => {
  const languages = [
    { name: "Hinglish", example: "Doctor sahib, ye medicine kab leni hai?" },
    { name: "हिंदी", example: "डॉक्टर साहब, यह दवा कब लेनी है?" },
    { name: "தமிழ்", example: "டாக்டர், இந்த மருந்து எப்போது எடுக்க வேண்டும்?" },
    { name: "বাংলা", example: "ডাক্তার, এই ওষুধ কখন খেতে হবে?" }
  ];

  return (
    <section 
      // className="py-20 relative overflow-hidden"
      // style={{
      //   backgroundImage: `url(${indiaBackground})`,
      //   backgroundSize: 'cover',
      //   backgroundPosition: 'center',
      // }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/95" />
      
      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold font-poppins text-foreground mb-6">
            <span className="text-transparent bg-gradient-hero bg-clip-text">Bharat-First</span> Strategy
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
            Breaking language barriers in healthcare with intelligent code-switching 
            and native language understanding
          </p>
        </div>

        {/* Main flow diagram */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Step 1: User Input */}
            <div className="relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {/* Step number */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                1
              </div>
              <div className="bg-card rounded-2xl p-8 shadow-medical border border-border/50 text-center">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Languages className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold font-poppins text-foreground mb-4">Your Input</h3>
                <p className="text-muted-foreground font-inter mb-4">
                  Speak or type in any Indian language or Hinglish
                </p>
                <div className="bg-accent rounded-lg p-3 text-sm text-accent-foreground font-medium">
                  "Doctor sahib, पेट में दर्द है"
                </div>
              </div>
            </div>

            {/* Step 2: Language Mapping */}
            <div className="relative animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              {/* Step number */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                2
              </div>
              <div className="bg-card rounded-2xl p-8 shadow-medical border border-border/50 text-center">
                <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Languages className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold font-poppins text-foreground mb-4">Language Mapping</h3>
                <p className="text-muted-foreground font-inter mb-4">
                  Translating Hinglish/native input to English for precision
                </p>
                <div className="bg-accent rounded-lg p-3 text-sm text-accent-foreground font-medium">
                  "I have stomach pain"
                </div>
              </div>
            </div>

            {/* Step 3: AI Processing */}
            <div className="relative animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              {/* Step number */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                3
              </div>
              <div className="bg-card rounded-2xl p-8 shadow-medical border border-border/50 text-center">
                <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold font-poppins text-foreground mb-4">AI Processing</h3>
                <p className="text-muted-foreground font-inter mb-4">
                  Understanding context in English for medical accuracy
                </p>
                <div className="bg-accent rounded-lg p-3 text-sm text-accent-foreground font-medium">
                  Medical Analysis ⚡ Context Understanding
                </div>
              </div>
            </div>

            {/* Step 4: Audio Response */}
            <div className="relative animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              {/* Step number */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                4
              </div>
              <div className="bg-card rounded-2xl p-8 shadow-medical border border-border/50 text-center">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Volume2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold font-poppins text-foreground mb-4">Audio Response</h3>
                <p className="text-muted-foreground font-inter mb-4">
                  Clear guidance in your preferred language with voice
                </p>
                <div className="bg-accent rounded-lg p-3 text-sm text-accent-foreground font-medium">
                  🔊 "पेट दर्द के लिए यह दवा..."
                </div>
              </div>
            </div>

          </div>
        </div>



        {/* Language examples */}
        <div className="max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
          <h3 className="text-2xl font-semibold font-poppins text-center text-foreground mb-8">
            Natural Conversation Examples
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {languages.map((lang, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-6 shadow-medical border border-border/50 hover:shadow-glow transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {lang.name}
                  </span>
                </div>
                <p className="text-foreground font-inter text-sm leading-relaxed">
                  "{lang.example}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Accessibility note */}
        <div className="mt-16 text-center animate-fade-in-up" style={{ animationDelay: '1.4s' }}>
          <div className="bg-gradient-subtle rounded-2xl p-8 max-w-4xl mx-auto border border-border/50">
            <h3 className="text-2xl font-semibold font-poppins text-foreground mb-4">
              🇮🇳 Accessibility for Every Indian
            </h3>
            <p className="text-muted-foreground font-inter leading-relaxed">
              Supporting 8+ major Indian languages with code-switching capabilities, 
              ensuring healthcare guidance is accessible to everyone, regardless of their 
              linguistic preference or literacy level.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BharatStrategy;