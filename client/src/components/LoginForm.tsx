
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Lock, User, Package } from "lucide-react";

const styles = `
  @keyframes subtleGlow {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.8; }
  }
  
  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .glow-effect {
    animation: subtleGlow 4s ease-in-out infinite;
  }
  
  .shimmer-effect {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    background-size: 1000px 100%;
    animation: shimmer 3s infinite;
  }
  
  .fade-in-up {
    animation: fadeInUp 0.8s ease-out forwards;
  }
  
  .fade-in-up-delay-1 {
    animation: fadeInUp 0.8s ease-out 0.1s forwards;
    opacity: 0;
  }
  
  .fade-in-up-delay-2 {
    animation: fadeInUp 0.8s ease-out 0.2s forwards;
    opacity: 0;
  }
`;

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
  isLoading?: boolean;
  error?: string;
}

export default function LoginForm({ onLogin, isLoading = false, error }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen flex items-center justify-center p-5 relative overflow-hidden" 
           style={{
             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
           }}>
        {/* Lighting effects - optimized for performance */}
        {/* Radial glow from center - light to dark */}
        <div className="absolute inset-0 glow-effect" style={{
          background: 'radial-gradient(ellipse 1200px 800px at 50% 30%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 25%, transparent 70%)'
        }}></div>
        
        {/* Vignette effect - darken edges */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 0%, rgba(0,0,0,0.3) 100%)'
        }}></div>
        
        {/* Subtle top-to-bottom lighting */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/20"></div>
        
        {/* Shimmer overlay - very subtle */}
        <div className="absolute inset-0 shimmer-effect pointer-events-none"></div>

        <Card className="w-full max-w-md relative z-10 shadow-2xl border-0 fade-in-up">
        <CardHeader className="text-center space-y-6 pb-8 fade-in-up-delay-1">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center text-white font-bold text-2xl shadow-lg transform hover:scale-105 transition-transform">
              <Package className="w-8 h-8" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Inventory System
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Sign in to access your inventory dashboard
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 fade-in-up-delay-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-semibold">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="pl-10 h-12 border-2 focus:border-[#667eea]"
                  required
                  data-testid="input-username"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 h-12 border-2 focus:border-[#667eea]"
                  required
                  data-testid="input-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {error && (
              <Alert variant="destructive" data-testid="alert-error" className="border-2">
                <AlertDescription className="font-medium">{error}</AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-base font-semibold shadow-lg hover:shadow-xl transition-all"
              disabled={isLoading}
              data-testid="button-login"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-100 rounded-xl text-center">
            <p className="text-sm text-blue-900 font-medium">
              Secure Authentication
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Your credentials are encrypted and protected
            </p>
          </div>
        </CardContent>
      </Card>
      </div>
    </>
  );
}
