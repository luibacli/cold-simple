"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Copy, Mail } from "lucide-react";
import { SendEmailButton } from "@/components/SendEmailButton";

interface EmailVariant {
  subject: string;
  body: string;
}

interface EmailOutputProps {
  emails: EmailVariant[];
  isLoading: boolean;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-600 transition-colors font-medium"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-green-500" />
          <span className="text-green-500">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          Copy
        </>
      )}
    </button>
  );
}

export function EmailOutput({ emails, isLoading }: EmailOutputProps) {
  if (isLoading) {
    return (
      <Card className="h-full border-dashed border-2 border-indigo-200 bg-indigo-50/30">
        <CardContent className="flex flex-col items-center justify-center h-64 gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Claude is writing your email...</p>
        </CardContent>
      </Card>
    );
  }

  if (emails.length === 0) {
    return (
      <Card className="h-full border-dashed border-2 border-gray-200">
        <CardContent className="flex flex-col items-center justify-center h-64 gap-3 text-center">
          <Mail className="w-10 h-10 text-gray-300" />
          <div>
            <p className="text-sm font-medium text-gray-400">Your email will appear here</p>
            <p className="text-xs text-gray-300 mt-1">Fill in the form and click Generate</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (emails.length === 1) {
    const email = emails[0];
    const fullText = `Subject: ${email.subject}\n\n${email.body}`;
    return (
      <Card className="border-indigo-100 shadow-sm">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-600 text-white text-xs">Generated</Badge>
          </div>
          <CopyButton text={fullText} />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-gray-50 rounded-lg px-3 py-2">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Subject</p>
            <p className="text-sm font-semibold text-gray-800">{email.subject}</p>
          </div>
          <div className="bg-gray-50 rounded-lg px-3 py-2">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Body</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{email.body}</p>
          </div>
          <SendEmailButton subject={email.subject} body={email.body} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="0" className="w-full">
      <div className="flex items-center justify-between mb-3">
        <TabsList className="bg-gray-100">
          {emails.map((_, i) => (
            <TabsTrigger key={i} value={String(i)} className="text-xs">
              Variant {i + 1}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {emails.map((email, i) => {
        const fullText = `Subject: ${email.subject}\n\n${email.body}`;
        return (
          <TabsContent key={i} value={String(i)}>
            <Card className="border-indigo-100 shadow-sm">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <Badge className="bg-indigo-600 text-white text-xs">Variant {i + 1}</Badge>
                <CopyButton text={fullText} />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-gray-50 rounded-lg px-3 py-2">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Subject</p>
                  <p className="text-sm font-semibold text-gray-800">{email.subject}</p>
                </div>
                <div className="bg-gray-50 rounded-lg px-3 py-2">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Body</p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{email.body}</p>
                </div>
                <SendEmailButton subject={email.subject} body={email.body} />
              </CardContent>
            </Card>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
