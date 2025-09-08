import { Camera, Brain, Globe, Volume2, MessageCircle, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

const UserJourney = () => {
  const steps = [
    {
      icon: Camera,
      title: "Upload Prescription",
      description: "Take a photo of your prescription or medical document",
      color: "text-primary",
      delay: "0s"
    },
    {
      icon: Brain,
      title: "AI Analysis",
      description: "Our AI reads and summarizes key medical instructions",
      color: "text-secondary",
      delay: "0.2s"
    },
    {
      icon: Globe,
      title: "Choose Language",
      description: "Select your preferred Indian language for the response",
      color: "text-primary",
      delay: "0.4s"
    },
    {
      icon: Volume2,
      title: "Audio Response",
      description: "Get spoken guidance in your chosen language",
      color: "text-secondary",
      delay: "0.6s"
    },
    {
      icon: MessageCircle,
      title: "Ask by Voice",
      description: "Ask follow-up questions using your voice in your regional language",
      color: "text-primary",
      delay: "0.8s"
    },    
    {
      icon: Monitor,
      title: "Web App Option",
      description: "Also available on our comprehensive web platform",
      color: "text-secondary",
      delay: "1s"
    }
  ];

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold font-poppins text-foreground mb-6">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-inter">
            Simple steps to get personalized health guidance in your language
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative group animate-fade-in-up hover:scale-105 transition-all duration-300"
                style={{ animationDelay: step.delay }}
              >
                <div className="bg-card rounded-2xl p-8 shadow-medical border border-border/50 hover:shadow-glow transition-all duration-300">
                  {/* Step number */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  
                  {/* Icon */}
                  <div className={`w-16 h-16 ${step.color} bg-accent rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-semibold font-poppins text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground font-inter leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connecting arrow for larger screens */}
                {/* {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-0.5 bg-gradient-primary"></div>
                    <div className="w-0 h-0 border-l-4 border-l-primary border-t-2 border-t-transparent border-b-2 border-b-transparent ml-6 -mt-2"></div>
                  </div>
                )} */}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-16 animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
          <Button 
            onClick={() => window.open('https://wa.me/14155238886?text=join%20from-are', '_blank')}
            variant="hero" 
            size="xl"
            className="group"
          >
            <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
            Try It Now - It's Free!
          </Button>
        </div>
      </div>
    </section>
  );
};

export default UserJourney;