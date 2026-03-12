import { useState } from 'react';
import { Moon, Sun, Bell, Lock, CreditCard, HelpCircle, LogOut } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface SettingItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}

function SettingItem({ icon: Icon, title, description, children }: SettingItemProps) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [currency, setCurrency] = useState('USD');

  const handleDarkModeToggle = (enabled: boolean) => {
    setDarkMode(enabled);
    document.documentElement.classList.toggle('dark', enabled);
    toast.success(enabled ? 'Dark mode enabled' : 'Light mode enabled');
  };

  const handleNotificationsToggle = (enabled: boolean) => {
    setNotifications(enabled);
    toast.success(enabled ? 'Notifications enabled' : 'Notifications disabled');
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your preferences and account</p>
        </div>

        {/* Appearance */}
        <div className="bg-card rounded-xl border border-border/50 p-6 animate-slide-up">
          <h2 className="text-lg font-semibold text-foreground mb-4">Appearance</h2>
          <div className="divide-y divide-border">
            <SettingItem
              icon={darkMode ? Moon : Sun}
              title="Dark Mode"
              description="Toggle dark theme"
            >
              <Switch
                checked={darkMode}
                onCheckedChange={handleDarkModeToggle}
              />
            </SettingItem>

            <SettingItem
              icon={CreditCard}
              title="Currency"
              description="Select your preferred currency"
            >
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="IDR">IDR (Rp)</SelectItem>
                </SelectContent>
              </Select>
            </SettingItem>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-card rounded-xl border border-border/50 p-6 animate-slide-up">
          <h2 className="text-lg font-semibold text-foreground mb-4">Notifications</h2>
          <div className="divide-y divide-border">
            <SettingItem
              icon={Bell}
              title="Push Notifications"
              description="Receive alerts and reminders"
            >
              <Switch
                checked={notifications}
                onCheckedChange={handleNotificationsToggle}
              />
            </SettingItem>
          </div>
        </div>

        {/* Security */}
        <div className="bg-card rounded-xl border border-border/50 p-6 animate-slide-up">
          <h2 className="text-lg font-semibold text-foreground mb-4">Security</h2>
          <div className="divide-y divide-border">
            <SettingItem
              icon={Lock}
              title="Change Password"
              description="Update your account password"
            >
              <Button variant="outline" size="sm">
                Update
              </Button>
            </SettingItem>
          </div>
        </div>

        {/* Support */}
        <div className="bg-card rounded-xl border border-border/50 p-6 animate-slide-up">
          <h2 className="text-lg font-semibold text-foreground mb-4">Support</h2>
          <div className="divide-y divide-border">
            <SettingItem
              icon={HelpCircle}
              title="Help & Support"
              description="Get help or contact us"
            >
              <Button variant="outline" size="sm">
                Contact
              </Button>
            </SettingItem>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-card rounded-xl border border-expense/20 p-6 animate-slide-up">
          <h2 className="text-lg font-semibold text-expense mb-4">Danger Zone</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Sign Out</p>
              <p className="text-sm text-muted-foreground">Log out of your account</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="border-expense/30 text-expense hover:bg-expense/10"
              onClick={() => toast.info('Sign out functionality would go here')}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
