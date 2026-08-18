import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { useStylistChat, useWardrobeItems, usePreferences } from '../lib/hooks';
import { Icon } from '../components/Icon';
import { Button } from '../components/Button';

interface ChatMsg {
  role: 'user' | 'assistant';
  message: string;
}

export function StylistChatScreen() {
  const { user } = useAuth();
  const { messages, loading, addMessage, clearChat } = useStylistChat(user?.id);
  const { items } = useWardrobeItems(user?.id);
  const { prefs } = usePreferences(user?.id);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const generateResponse = (question: string): string => {
    const q = question.toLowerCase();
    const wardrobe = items.map((i) => `${i.name} (${i.color || 'no color'}, ${i.occasion})`).join(', ');
    const styles = prefs?.style_preferences?.join(', ') || 'not specified';
    const favColors = prefs?.favorite_colors?.length ? prefs.favorite_colors.join(', ') : 'not specified';

    if (q.includes('weather') || q.includes('cold') || q.includes('hot') || q.includes('warm') || q.includes('rain')) {
      return `Based on your wardrobe, I'd recommend layering appropriately for the weather. You have ${items.length} items to work with. For cooler days, check your outerwear pieces; for warmer weather, opt for lighter tops and bottoms. Would you like me to suggest a specific outfit?`;
    }
    if (q.includes('work') || q.includes('office') || q.includes('professional')) {
      const workItems = items.filter((i) => i.occasion === 'work' || i.occasion === 'formal');
      return workItems.length > 0
        ? `For a work outfit, I'd pair your ${workItems.slice(0, 3).map((i) => i.name).join(' and ')}. Keep it polished but comfortable. Check the Home tab for a complete suggestion!`
        : `I don't see work-appropriate items in your wardrobe yet. Try adding a blazer, dress pants, or a button-up shirt to get office-ready suggestions.`;
    }
    if (q.includes('color') || q.includes('match')) {
      return favColors !== 'not specified'
        ? `Your favorite colors are ${favColors}. When building outfits, I prioritize these. For color matching, complementary colors (opposite on the color wheel) create striking looks, while analogous colors (adjacent) create harmony.`
        : `Set your favorite and avoid colors in Preferences to get personalized color-matching advice. Currently your wardrobe has ${items.length} items.`;
    }
    if (q.includes('style') || q.includes('trend')) {
      return `Your style preferences are ${styles}. ${styles !== 'not specified' ? 'I use these to tailor suggestions — try refreshing the Home tab for new outfit ideas that match your aesthetic.' : 'Set your style preferences to get personalized suggestions!'}`;
    }
    if (q.includes('wardrobe') || q.includes('have') || q.includes('clothes')) {
      return `You have ${items.length} items in your wardrobe${wardrobe ? `: ${wardrobe}` : ''}. ${items.length < 10 ? 'Adding more items will give you richer outfit combinations!' : 'That\'s a great collection for varied outfit suggestions.'}`;
    }
    if (q.includes('date') || q.includes('night out')) {
      return `For a date or night out, I'd suggest choosing your most stylish pieces and adding an accessory for personality. Check the Home tab with the "night out" or "date" occasion selected for a complete look!`;
    }
    if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
      return `Hello! I'm your AI stylist. I can help with outfit suggestions, color matching, weather-appropriate clothing, and style advice. You have ${items.length} items in your wardrobe. What would you like help with?`;
    }

    return `Great question! Based on your ${items.length}-item wardrobe and ${styles} style preferences, I'd recommend checking the Home tab for AI-generated outfit suggestions. You can also tell me about a specific occasion or weather condition, and I'll give targeted advice. Try asking about "work outfits," "color matching," or "what to wear in cold weather."`;
  };

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    const question = input.trim();
    setInput('');
    setSending(true);
    try {
      await addMessage('user', question);
      const response = generateResponse(question);
      await addMessage('assistant', response);
    } catch (e) {
      console.error(e);
    }
    setSending(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = [
    'What should I wear to work?',
    'Help me match colors',
    'What\'s in my wardrobe?',
    'Outfit for a date night',
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-earth-900">AI Stylist</h1>
          <p className="text-earth-500 mt-1">Chat with your personal fashion advisor</p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => { if (confirm('Clear chat history?')) clearChat(); }}
            className="text-sm text-earth-400 hover:text-red-500 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-[300px]">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Icon name="Loader2" size={24} className="animate-spin text-earth-300" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-gold-50 flex items-center justify-center mx-auto mb-4">
              <Icon name="Sparkles" size={28} className="text-gold-500" />
            </div>
            <h3 className="font-serif text-xl font-bold text-earth-900 mb-2">Ask me anything</h3>
            <p className="text-earth-500 text-sm mb-6">I know about your {items.length} wardrobe items and style preferences</p>
            <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="badge px-3 py-2 text-sm bg-white text-earth-600 border border-earth-200 hover:border-gold-300 hover:text-gold-700 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={msg.id || i}
              className={`flex gap-3 animate-slide-up ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-earth-200' : 'bg-gold-400'}`}>
                <Icon name={msg.role === 'user' ? 'User' : 'Sparkles'} size={16} className={msg.role === 'user' ? 'text-earth-600' : 'text-earth-900'} />
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-earth-900 text-white' : 'bg-white border border-earth-100 text-earth-900'}`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2 items-end">
        <div className="flex-1 relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask your stylist..."
            rows={1}
            className="input resize-none pr-12 min-h-[48px] max-h-32"
            style={{ height: 'auto' }}
          />
        </div>
        <Button
          onClick={handleSend}
          loading={sending}
          disabled={!input.trim()}
          icon="Send"
          size="md"
        >Send</Button>
      </div>
    </div>
  );
}
