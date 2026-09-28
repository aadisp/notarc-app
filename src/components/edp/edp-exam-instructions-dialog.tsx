"use client";

import { Dialog as DialogPrimitive } from "radix-ui";
import {
    EXAM_INSTRUCTIONS,
    EXAM_INSTRUCTIONS_TITLE,
} from "@/lib/edp/exam-instructions";

interface EdpExamInstructionsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onStartExam: () => void;
    resuming?: boolean;
}

export default function EdpExamInstructionsDialog({
    open,
    onOpenChange,
    onStartExam,
    resuming = false,
}: EdpExamInstructionsDialogProps) {
    return (
        <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
            <DialogPrimitive.Portal>

                <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />

                <DialogPrimitive.Content
                    className="
                        fixed
                        left-1/2
                        top-1/2
                        z-50
                        flex
                        max-h-[85vh]
                        w-[92vw]
                        max-w-lg
                        -translate-x-1/2
                        -translate-y-1/2
                        flex-col
                        overflow-hidden
                        rounded-2xl
                        border
                        border-white/10
                        bg-[#12151a]
                        text-white
                        shadow-2xl
                        outline-none
                    "
                >

                    <div className="border-b border-white/10 px-6 py-5">
                        <DialogPrimitive.Title className="text-xl font-bold text-white">
                            {EXAM_INSTRUCTIONS_TITLE}
                        </DialogPrimitive.Title>
                        <DialogPrimitive.Description className="mt-1 text-xs text-white/50">
                            Please read carefully before you begin. Your exam
                            starts as soon as you grant camera and microphone
                            access on the next screen.
                        </DialogPrimitive.Description>
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 py-4">
                        <ul className="space-y-3 text-sm leading-6 text-white/70">
                            {EXAM_INSTRUCTIONS.map((line, index) => (
                                <li key={index} className="flex gap-2.5">
                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                                    <span>{line}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-white/10 bg-white/[0.02] px-6 py-4">

                        <DialogPrimitive.Close asChild>
                            <button
                                type="button"
                                className="rounded-full px-4 py-2.5 text-sm font-medium text-white/60 transition hover:text-white"
                            >
                                Cancel
                            </button>
                        </DialogPrimitive.Close>

                        <button
                            type="button"
                            onClick={onStartExam}
                            className="rounded-full bg-amber-400 px-6 py-2.5 text-sm font-bold text-black transition hover:bg-amber-300"
                        >
                            {resuming ? "Resume Exam" : "Start Exam"}
                        </button>

                    </div>

                </DialogPrimitive.Content>

            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}
