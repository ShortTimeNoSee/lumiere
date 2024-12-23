import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const PricingTier = ({
  name,
  price,
  features,
  isPopular = false,
  onSelect,
}: {
  name: string;
  price: string;
  features: string[];
  isPopular?: boolean;
  onSelect: () => void;
}) => (
  <div className={`relative rounded-2xl p-6 ${isPopular ? 'bg-gradient-to-b from-purple-600/10 to-orange-500/10 border-2 border-purple-500/20' : 'bg-secondary/50'}`}>
    {isPopular && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
        <span className="bg-gradient-to-r from-purple-600 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          Most Popular
        </span>
      </div>
    )}
    
    <h3 className="text-2xl font-bold mb-2">{name}</h3>
    <div className="mb-6">
      <span className="text-4xl font-bold">{price}</span>
      {price !== "Free" && <span className="text-muted-foreground">/month</span>}
    </div>
    
    <ul className="space-y-3 mb-6">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center gap-2">
          <Check className="h-5 w-5 text-green-500" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    
    <Button 
      onClick={onSelect}
      className={`w-full ${
        isPopular 
          ? 'bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600' 
          : ''
      }`}
    >
      {price === "Free" ? "Current Plan" : "Upgrade Now"}
    </Button>
  </div>
);

const Upgrade = () => {
  const { toast } = useToast();

  const handleUpgrade = async (tier: string) => {
    toast({
      title: "Coming Soon",
      description: "Payment processing will be implemented shortly.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12 animate-fade-in">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
              Upgrade Your Experience
            </h1>
            <p className="text-xl text-muted-foreground">
              Choose the perfect plan for your creative journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <PricingTier
              name="Basic"
              price="Free"
              features={[
                "High-quality image uploads",
                "Basic compression",
                "Create unlimited pins",
                "Join the community"
              ]}
              onSelect={() => handleUpgrade("basic")}
            />
            
            <PricingTier
              name="Pro"
              price="$9.99"
              features={[
                "Everything in Basic",
                "Full resolution uploads",
                "No compression",
                "Advanced analytics",
                "Priority support"
              ]}
              isPopular
              onSelect={() => handleUpgrade("pro")}
            />
            
            <PricingTier
              name="Enterprise"
              price="$29.99"
              features={[
                "Everything in Pro",
                "Custom branding",
                "API access",
                "Dedicated support",
                "Early access features"
              ]}
              onSelect={() => handleUpgrade("enterprise")}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Upgrade;