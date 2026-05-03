import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  ChevronDown, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  ExternalLink,
  HelpCircle,
  Headset
} from "lucide-react";
import { Header } from "@/features/shared/components/ProfileShared";
import { useAuthStore } from "@/store/auth/authStore";
import { useSupportStore } from "@/store/customer/supportStore";
import { cn } from "@/lib/utils";
import database from "@/data/database.json";

export default function SupportPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { faqs, tickets, fetchSupportData, isLoading } = useSupportStore();
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchSupportData(user.id);
    }
  }, [user, fetchSupportData]);

  const contactMethods = [
    {
      id: "telegram",
      name: "Telegram Support",
      description: "Chat with our support bot",
      icon: <MessageCircle className="text-blue-500" size={24} />,
      action: () => window.open("https://t.me/ASTUEatsSupport", "_blank"),
      color: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      id: "phone",
      name: "Call Hotline",
      description: "Available 8 AM - 10 PM",
      icon: <Phone className="text-green-500" size={24} />,
      action: () => window.open("tel:+251911234567", "_blank"),
      color: "bg-green-50 dark:bg-green-950/20"
    },
    {
      id: "email",
      name: "Email Us",
      description: "Get a response in 24h",
      icon: <Mail className="text-orange-500" size={24} />,
      action: () => window.open("mailto:support@astueats.com", "_blank"),
      color: "bg-orange-50 dark:bg-orange-950/20"
    }
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "RESOLVED": return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
      case "UNDER_REVIEW": return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
      case "PENDING": return "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400";
      default: return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "RESOLVED": return <CheckCircle2 size={14} />;
      case "UNDER_REVIEW": return <Clock size={14} />;
      case "PENDING": return <AlertCircle size={14} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 font-sans pb-28">
      <Header title="Support Center" showBack onBackClick={() => navigate(-1)} />

      <main className="px-5 pt-6 space-y-8">
        {/* --- Hero Section --- */}
        <div className="relative overflow-hidden bg-[#F26A1C] rounded-[32px] p-8 text-white">
           <div className="absolute -right-8 -bottom-8 opacity-10">
              <Headset size={160} />
           </div>
           <h2 className="text-2xl font-black mb-2">How can we help?</h2>
           <p className="text-white/80 text-sm font-medium leading-relaxed max-w-[200px]">
              Our support team is here to ensure your experience is smooth.
           </p>
        </div>

        {/* --- Contact Channels --- */}
        <div className="space-y-3">
          <h3 className="text-[11px] font-black uppercase tracking-[0.1em] text-gray-400 px-1">
             Contact Channels
          </h3>
          <div className="grid gap-3">
            {contactMethods.map((method) => (
              <button
                key={method.id}
                onClick={method.action}
                className="w-full flex items-center p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[24px] shadow-sm active:scale-[0.98] transition-all"
              >
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mr-4", method.color)}>
                  {method.icon}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-black text-[15px] text-gray-900 dark:text-white leading-tight">{method.name}</p>
                  <p className="text-[12px] font-bold text-gray-400">{method.description}</p>
                </div>
                <ChevronRight className="text-gray-300" size={18} />
              </button>
            ))}
          </div>
        </div>

        {/* --- Active Support Tickets --- */}
        {tickets.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[11px] font-black uppercase tracking-[0.1em] text-gray-400">
                My Support Tickets
              </h3>
              {isLoading && <Clock className="text-gray-300 animate-spin" size={14} />}
            </div>
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div 
                  key={ticket.id}
                  className="p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[28px] shadow-sm space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase">Case #{ticket.id.slice(-6).toUpperCase()}</p>
                      <p className="font-bold text-[14px] text-gray-800 dark:text-gray-200 line-clamp-2 leading-snug">
                        {ticket.reason}
                      </p>
                    </div>
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-black flex items-center gap-1 uppercase tracking-wider",
                      getStatusStyle(ticket.status)
                    )}>
                      {getStatusIcon(ticket.status)}
                      {ticket.status.replace("_", " ")}
                    </span>
                  </div>
                  
                  {ticket.resolution && (
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-[16px] border-l-2 border-green-500">
                      <p className="text-[10px] font-black text-green-600 dark:text-green-400 uppercase mb-1">Resolution</p>
                      <p className="text-[12px] font-medium text-gray-600 dark:text-gray-300">{ticket.resolution}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <p className="text-[10px] font-bold text-gray-400">
                      Opened {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                    <button className="text-[#F26A1C] text-[11px] font-black flex items-center gap-1 hover:underline">
                      View Details <ExternalLink size={10} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- FAQ Section --- */}
        <div className="space-y-4">
          <h3 className="text-[11px] font-black uppercase tracking-[0.1em] text-gray-400 px-1">
             Frequently Asked Questions
          </h3>
          <div className="space-y-2">
            {faqs.map((faq) => (
              <div 
                key={faq.id}
                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[24px] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between p-5 text-left active:bg-gray-50 dark:active:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="text-gray-400" size={18} />
                    <span className="font-bold text-[14px] text-gray-700 dark:text-gray-300 pr-4">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown 
                    className={cn(
                      "text-gray-300 transition-transform duration-300",
                      openFaq === faq.id ? "rotate-180" : ""
                    )} 
                    size={20} 
                  />
                </button>
                <div className={cn(
                  "px-5 overflow-hidden transition-all duration-300 ease-in-out",
                  openFaq === faq.id ? "max-h-40 pb-5 opacity-100" : "max-h-0 opacity-0"
                )}>
                  <p className="text-[13px] font-medium text-gray-500 leading-relaxed pt-2 border-t border-gray-50 dark:border-gray-800">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Footer Note --- */}
        <div className="py-8 text-center space-y-2">
           <div className="flex items-center justify-center gap-2 text-gray-300">
              <div className="h-[1px] w-8 bg-current" />
              <HelpCircle size={16} />
              <div className="h-[1px] w-8 bg-current" />
           </div>
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              ASTU Eats Support System v{database.version}
           </p>
        </div>
      </main>

      {/* --- Floating Quick Support Button --- */}
      <div className="fixed bottom-24 right-6 z-40">
         <button 
           onClick={() => navigate("/customer/orders")}
           className="h-14 w-14 bg-[#F26A1C] text-white rounded-2xl flex items-center justify-center shadow-[0_8px_24px_rgba(242,106,28,0.4)] active:scale-90 transition-transform"
         >
            <AlertCircle size={28} />
         </button>
      </div>
    </div>
  );
}
