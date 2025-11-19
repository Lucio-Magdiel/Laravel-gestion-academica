import { Alert, AlertDescription } from '@/components/ui/alert';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import React from 'react';

export function FlashMessages() {
    const { flash } = usePage<SharedData>().props;
    const [visible, setVisible] = React.useState(true);

    React.useEffect(() => {
        if (flash?.success || flash?.error || flash?.message) {
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    if (!visible || (!flash?.success && !flash?.error && !flash?.message)) {
        return null;
    }

    return (
        <div className="fixed top-4 right-4 z-50 w-full max-w-md space-y-2">
            {flash.success && (
                <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertDescription className="text-green-800 dark:text-green-200">
                        {flash.success}
                    </AlertDescription>
                </Alert>
            )}
            {flash.error && (
                <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                    <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <AlertDescription className="text-red-800 dark:text-red-200">
                        {flash.error}
                    </AlertDescription>
                </Alert>
            )}
            {flash.message && (
                <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
                    <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <AlertDescription className="text-blue-800 dark:text-blue-200">
                        {flash.message}
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}
