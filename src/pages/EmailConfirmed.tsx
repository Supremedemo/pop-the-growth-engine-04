
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const EmailConfirmed = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Record the email confirmation if user is authenticated
    const recordConfirmation = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('email_confirmations').insert({
          user_id: user.id
        });
      }
    };
    
    recordConfirmation();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-green-800">Email Confirmed!</CardTitle>
          <CardDescription className="text-lg">
            Thank you for confirming your email address.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-slate-600">
              Your email has been successfully verified. You can now log in to Pop The Builder and start creating amazing popups.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={() => navigate("/auth")}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Log In to Pop The Builder
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
