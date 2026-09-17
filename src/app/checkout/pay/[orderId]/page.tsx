import type { Metadata } from "next";
import SiteLayout from "@/components/layout/site-layout";
import CheckoutPayPage from "@/components/checkout/checkout-pay-page";

export const metadata: Metadata = {
    title: "Complete Payment",
};

interface PageProps {
    params: Promise<{
        orderId: string;
    }>;
}

export default async function Page({ params }: PageProps) {

    const { orderId } = await params;

    return (
        <SiteLayout>
            <div className="min-h-screen bg-[#0b0d10]">
                <CheckoutPayPage orderId={orderId} />
            </div>
        </SiteLayout>
    );

}
