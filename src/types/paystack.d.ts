interface PaystackResponse {
    reference: string;
    status: string;
    message: string;
    trans: string;
    transaction: string;
    trxref: string;
}

interface PaystackOptions {
    key: string;
    email: string;
    amount: number;
    currency: string;
    reference: string;
    onClose: () => void;
    callback: (response: PaystackResponse) => void;
}

interface PaystackPopInstance {
    openIframe: () => void;
}

interface PaystackPop {
    setup: (options: PaystackOptions) => PaystackPopInstance;
}

interface Window {
    PaystackPop: PaystackPop;
}
