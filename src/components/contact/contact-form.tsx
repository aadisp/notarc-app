"use client";

import { useState } from "react";
import {
    addDoc,
    collection,
    serverTimestamp,
} from "firebase/firestore";
import emailjs from "@emailjs/browser";
import { db } from "@/firebase/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
export default function ContactForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

   async function handleSubmit(
        e: React.FormEvent
    ) {
        e.preventDefault();
        setIsSubmitting(true);

        try {

            await addDoc(
                collection(db, "contacts"),
                {

                    name,
                    email,
                    phone,
                    subject,
                    message,

                    createdAt: serverTimestamp(),

                    status: "new",

                }
            );

            await emailjs.send(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
                {
                    name,
                    email,
                    phone,
                    subject,
                    message,
                },
                process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
            );

            toast.success("Message sent successfully!", {
                description: "We'll get back to you as soon as possible.",
            });

            setName("");
            setEmail("");
            setPhone("");
            setSubject("");
            setMessage("");

        }

        catch (error) {

            console.error(error);

            toast.error("Failed to send message.", {
                description: "Please try again in a few moments.",
            });

        }

        finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="rounded-3xl border bg-white p-8 shadow-sm">

            <div className="mb-8">

                <h2 className="text-3xl font-bold">
                    Send us a Message
                </h2>

                <p className="mt-3 text-muted-foreground">
                    Fill out the form below and we'll get back to you as soon as possible.
                </p>

            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >

                <div className="grid gap-5 md:grid-cols-2">

                    <div>

                        <label className="mb-2 block text-sm font-medium">
                            Full Name
                        </label>

                        <Input
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                    </div>

                    <div>

                        <label className="mb-2 block text-sm font-medium">
                            Email Address
                        </label>

                        <Input
                            type="email"
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                    </div>

                </div>

                <div className="grid gap-5 md:grid-cols-2">

                    <div>

                        <label className="mb-2 block text-sm font-medium">
                            Phone Number
                        </label>

                        <Input
                            placeholder="+91 XXXXX XXXXX"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />

                    </div>

                    <div>

                        <label className="mb-2 block text-sm font-medium">
                            Subject
                        </label>

                        <Input
                            placeholder="How can we help?"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />

                    </div>

                </div>

                <div>

                    <label className="mb-2 block text-sm font-medium">
                        Message
                    </label>

                    <textarea
                        rows={7}
                        className="w-full rounded-xl border border-input bg-transparent px-4 py-3 outline-none transition focus:ring-2 focus:ring-primary"
                        placeholder="Tell us about your project or enquiry..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />

                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 text-base"
                >
                    {isSubmitting ? "Sending..." : "Send Message"}
                </Button>

            </form>

        </div>
    );
}