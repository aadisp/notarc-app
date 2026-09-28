"use client";

import { useEffect, useState } from "react";
import {
    collection,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import { Loader2, MapPin, Plus } from "lucide-react";
import { toast } from "sonner";
import { auth, db } from "@/firebase/firebase";
import type { Address, SavedAddress } from "@/types/address";

export type AddressSelection =
    | { kind: "saved"; addressId: string }
    | { kind: "new"; address: Address };

interface Props {
    onSelectionChange: (selection: AddressSelection | null) => void;
}

const EMPTY_FORM: Address = {
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
};

const PHONE_PATTERN = /^\d{10}$/;
const PINCODE_PATTERN = /^\d{6}$/;

function isFormValid(form: Address): boolean {
    return (
        form.fullName.trim().length > 0 &&
        PHONE_PATTERN.test(form.phone) &&
        form.line1.trim().length > 0 &&
        form.city.trim().length > 0 &&
        form.state.trim().length > 0 &&
        PINCODE_PATTERN.test(form.pincode)
    );
}

export default function AddressSelector({ onSelectionChange }: Props) {

    const [loading, setLoading] = useState(true);
    const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);

    // "existing" while picking from saved addresses, "new" while
    // filling out the form. Starts on "new" until we know whether
    // there's anything saved to pick from.
    const [mode, setMode] = useState<"existing" | "new">("new");
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [form, setForm] = useState<Address>(EMPTY_FORM);

    useEffect(() => {

        let cancelled = false;

        async function loadAddresses() {

            const user = auth.currentUser;

            if (!user) {
                setLoading(false);
                return;
            }

            try {

                // Deliberately no orderBy() here: pairing an equality
                // where() with orderBy() on a *different* field (userId
                // vs. lastUsedAt) requires a Firestore composite index.
                // This project doesn't have one deployed, so that
                // version of the query used to fail every time with
                // "FAILED_PRECONDITION: The query requires an index" —
                // caught below and only logged, which is why saved
                // addresses never appeared. Filtering by userId alone
                // only needs the automatic single-field index, so we
                // sort and take the top 3 client-side instead.
                const addressesQuery = query(
                    collection(db, "addresses"),
                    where("userId", "==", user.uid)
                );

                const snap = await getDocs(addressesQuery);

                if (cancelled) return;

                const all = snap.docs.map((docSnap) => ({
                    id: docSnap.id,
                    ...docSnap.data(),
                })) as SavedAddress[];

                const results = all
                    .sort((a, b) => {
                        const aTime = a.lastUsedAt?.toMillis() ?? 0;
                        const bTime = b.lastUsedAt?.toMillis() ?? 0;
                        return bTime - aTime;
                    })
                    .slice(0, 3);

                setSavedAddresses(results);

                if (results.length > 0) {
                    setMode("existing");
                    setSelectedId(results[0].id);
                } else {
                    setMode("new");
                }

            } catch (error) {
                console.error("Could not load saved addresses:", error);
                toast.error(
                    "Couldn't load your saved addresses — you can still enter one below."
                );
            } finally {
                if (!cancelled) setLoading(false);
            }

        }

        loadAddresses();

        return () => {
            cancelled = true;
        };

    }, []);

    // Reports the current selection up to the checkout page whenever
    // it changes, so "Place Order" can stay disabled until there's a
    // valid address either picked or fully filled in.
    useEffect(() => {

        if (mode === "existing") {
            onSelectionChange(
                selectedId ? { kind: "saved", addressId: selectedId } : null
            );
            return;
        }

        onSelectionChange(
            isFormValid(form) ? { kind: "new", address: form } : null
        );

    }, [mode, selectedId, form, onSelectionChange]);

    function updateField<K extends keyof Address>(key: K, value: string) {
        setForm((current) => ({ ...current, [key]: value }));
    }

    if (loading) {
        return (
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/40">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading your addresses...
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">

            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                <MapPin className="h-4.5 w-4.5" />
                Shipping Address
            </h2>

            {savedAddresses.length > 0 && (
                <div className="mb-4 space-y-2.5">
                    {savedAddresses.map((address) => (
                        <button
                            key={address.id}
                            type="button"
                            onClick={() => {
                                setMode("existing");
                                setSelectedId(address.id);
                            }}
                            className={`w-full rounded-xl border px-4 py-3.5 text-left text-sm transition ${
                                mode === "existing" && selectedId === address.id
                                    ? "border-white/60 bg-white/[0.08]"
                                    : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"
                            }`}
                        >
                            <p className="font-semibold text-white">
                                {address.fullName}
                                <span className="ml-2 font-normal text-white/40">
                                    {address.phone}
                                </span>
                            </p>
                            <p className="mt-0.5 text-white/60">
                                {address.line1}
                                {address.line2 ? `, ${address.line2}` : ""},{" "}
                                {address.city}, {address.state} -{" "}
                                {address.pincode}
                            </p>
                        </button>
                    ))}

                    <button
                        type="button"
                        onClick={() => {
                            setMode("new");
                            setSelectedId(null);
                        }}
                        className={`flex w-full items-center gap-2 rounded-xl border px-4 py-3.5 text-left text-sm font-semibold transition ${
                            mode === "new"
                                ? "border-white/60 bg-white/[0.08] text-white"
                                : "border-dashed border-white/15 text-white/50 hover:bg-white/[0.05]"
                        }`}
                    >
                        <Plus className="h-4 w-4" />
                        Use a New Address
                    </button>
                </div>
            )}

            {mode === "new" && (
                <div className="space-y-3">

                    <input
                        value={form.fullName}
                        onChange={(e) => updateField("fullName", e.target.value)}
                        placeholder="Full Name"
                        className="h-11 w-full rounded-lg border border-white/15 bg-white/5 px-3.5 text-sm text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none"
                    />

                    <input
                        value={form.phone}
                        onChange={(e) =>
                            updateField(
                                "phone",
                                e.target.value.replace(/\D/g, "").slice(0, 10)
                            )
                        }
                        inputMode="numeric"
                        placeholder="10-digit phone number"
                        className="h-11 w-full rounded-lg border border-white/15 bg-white/5 px-3.5 text-sm text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none"
                    />

                    <input
                        value={form.line1}
                        onChange={(e) => updateField("line1", e.target.value)}
                        placeholder="Address Line 1"
                        className="h-11 w-full rounded-lg border border-white/15 bg-white/5 px-3.5 text-sm text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none"
                    />

                    <input
                        value={form.line2}
                        onChange={(e) => updateField("line2", e.target.value)}
                        placeholder="Address Line 2 (optional)"
                        className="h-11 w-full rounded-lg border border-white/15 bg-white/5 px-3.5 text-sm text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none"
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <input
                            value={form.city}
                            onChange={(e) => updateField("city", e.target.value)}
                            placeholder="City"
                            className="h-11 w-full rounded-lg border border-white/15 bg-white/5 px-3.5 text-sm text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none"
                        />
                        <input
                            value={form.state}
                            onChange={(e) => updateField("state", e.target.value)}
                            placeholder="State"
                            className="h-11 w-full rounded-lg border border-white/15 bg-white/5 px-3.5 text-sm text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none"
                        />
                    </div>

                    <input
                        value={form.pincode}
                        onChange={(e) =>
                            updateField(
                                "pincode",
                                e.target.value.replace(/\D/g, "").slice(0, 6)
                            )
                        }
                        inputMode="numeric"
                        placeholder="Pincode"
                        className="h-11 w-full max-w-[200px] rounded-lg border border-white/15 bg-white/5 px-3.5 text-sm text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none"
                    />

                </div>
            )}

        </div>
    );
}