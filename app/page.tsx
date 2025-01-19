"use client";

import LandingSections from "@/components/LandingSections";
import { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send, Loader2, ArrowBigDownIcon, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@ai-sdk/react";
import { BiBot } from "react-icons/bi";



export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop, reload, error } = useChat({ api: "/api/gemini" }); // For OpenAI, use "/api/openai"

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showChatIcon, setShowChatIcon] = useState(true);
  const chatIconRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowChatIcon(true);
      } else {
        setShowChatIcon(false);
        setIsChatOpen(false)
      }
    }
    // handleScroll();
    // window.addEventListener('scroll', handleScroll);
    // return () => {
    //   window.removeEventListener('scroll', handleScroll);
    // }
  }, []);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  }

  useEffect(() => {
    if (scrollRef && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);


  return (

    <div className="flex flex-col min-h-screen">

      <LandingSections />

      <AnimatePresence>
        {showChatIcon && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 sm:bottom-4 sm:right-4"
          >
            <Button
              ref={chatIconRef}
              size="icon"
              onClick={toggleChat}
              className="rounded-full p-6 shadow-lg hover:bg-white-700"
            >
              {!isChatOpen ? (
                <BiBot color="white" size={50} />
              ) : (
                <ArrowBigDownIcon size={50} color="white" />
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed bottom-16 right-4 z-50 w-[95%] max-w-md md:w-[500px] sm:max-w-full"
          >
            <Card className="border-2 w-full bg-white shadow-lg rounded-lg">
              {/* Header */}
              <CardHeader className="relative flex flex-row items-center justify-between pb-1 border-b border-gray-200">
                <div className="flex flex-col space-y-1 pl-4">
                  <CardTitle className="text-2xl font-bold text-gray-800 sm:text-lg">
                    Chat with AI
                  </CardTitle>
                  <span className="text-xs text-gray-500 font-semibold bg-gray-100 px-2 py-1 rounded-full">
                    by Rupam
                  </span>
                </div>
                <Button
                  size="icon"
                  onClick={toggleChat}
                  variant="ghost"
                  className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-200 transition duration-200 ease-in-out"
                >
                  <X size={20} />
                  <span className="sr-only">Close Chat</span>
                </Button>
              </CardHeader>

              {/* Content */}
              <CardContent>
                <ScrollArea className="h-[300px] pr-4 sm:h-[250px]">
                  {messages.length === 0 && (
                    <div className="w-full mt-32 text-gray-500 flex items-center justify-center flex-col gap-3 sm:mt-16">
                      No messages yet.
                    </div>
                  )}
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`mt-4 ${message.role === "user" ? "text-right" : "text-left"}`}
                    >
                      <div
                        className={`p-2 rounded-md inline-block ${message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                          }`}
                      >
                        <ReactMarkdown
                          children={message.content}
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code: ({ node, inline, className, children, ...props }) =>
                              inline ? (
                                <code
                                  {...props}
                                  className="bg-gray-200 px-1 rounded"
                                >
                                  {children}
                                </code>
                              ) : (
                                <pre
                                  {...(props as React.HTMLAttributes<HTMLPreElement>)}
                                  className="bg-gray-200 p-2 rounded"
                                >
                                  <code>{children}</code>
                                </pre>
                              ),
                            ul: ({ children }) => (
                              <ul className="list-disc ml-4">{children}</ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="list-decimal ml-4">{children}</ol>
                            ),
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="w-full flex items-center justify-center gap-3">
                      <Loader2
                        className="animate-spin h-5 w-5 text-primary"
                        size={24}
                      />
                      <button className="underline" onClick={() => stop}>
                        Stop
                      </button>
                    </div>
                  )}
                  {error && (
                    <div className="w-full flex items-center justify-center gap-3">
                      <p className="text-red-500">An error occurred</p>
                      <button onClick={() => reload}>Reload</button>
                    </div>
                  )}
                  <div ref={scrollRef}></div>
                </ScrollArea>
              </CardContent>

              {/* Footer */}
              <CardFooter className="p-3">
                <form
                  onSubmit={handleSubmit}
                  className="flex items-center space-x-2 w-full"
                >
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your message here..."
                    className="flex-grow p-2 rounded-md border border-gray-300 sm:p-1"
                    required={true}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isLoading}
                    className="p-2 text-white rounded-md hover:bg-grey-700 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2
                        className="animate-spin text-white h-5 w-5 text-primary"
                        size={24}
                      />
                    ) : (
                      <Send size={16} />
                    )}
                  </Button>
                </form>
              </CardFooter>
              <div className="flex justify-center items-center border-t border-gray-200 mt-3 pt-2 mb-2 space-x-2">
                <span className="text-sm text-gray-500 sm:text-xs">
                  Powered by <strong className="text-gray-800">CodelabsIndia</strong>
                </span>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

  );
}
