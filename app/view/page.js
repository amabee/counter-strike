"use client";
import { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { User2 } from "lucide-react";

export default function ViewPage() {
  const [queueData, setQueueData] = useState({ cashiers: [] });
  const [animatingIds, setAnimatingIds] = useState(new Set());
  const previousNumbersRef = useRef({});
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/notif.mp3");
    audioRef.current.volume = 1;

    queueData.cashiers.forEach((cashier) => {
      previousNumbersRef.current[cashier.id] = cashier.currentNumber;
    });

    const eventSource = new EventSource("/api/events");

    eventSource.onmessage = (event) => {
      const newData = JSON.parse(event.data);

      newData.cashiers.forEach((cashier) => {
        const previousNumber = previousNumbersRef.current[cashier.id];
        if (
          previousNumber !== undefined &&
          cashier.currentNumber !== previousNumber
        ) {
          audioRef.current.play().catch((err) => {
            console.error("Error playing sound:", err);
          });
          setAnimatingIds((prev) => new Set([...prev, cashier.id]));
          setTimeout(() => {
            setAnimatingIds((prev) => {
              const newSet = new Set(prev);
              newSet.delete(cashier.id);
              return newSet;
            });
          }, 1000);
        }
        previousNumbersRef.current[cashier.id] = cashier.currentNumber;
      });

      setQueueData(newData);
    };

    return () => eventSource.close();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="p-4 lg:p-8 h-screen flex flex-col">
        <Card className="flex-1 shadow-xl flex flex-col">
          <CardHeader className="border-b bg-white py-6">
            <div className="flex items-center justify-center space-x-4">
              <h1 className="text-6xl font-bold text-gray-800">Queue Status</h1>
              <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" />
            </div>
            <p className="text-center text-gray-500 mt-4 text-2xl">
              Real-time counter updates
            </p>
          </CardHeader>
          <CardContent className="flex-1 p-8 flex items-center">
            <div className="grid grid-cols-3 gap-8 w-full h-full">
              {Array.from({ length: queueData.cashiers.length }).map(
                (_, index) => {
                  const cashier = queueData.cashiers[index];
                  if (!cashier || !cashier.isActive) {
                    return (
                      <div
                        key={cashier.id}
                        className="relative overflow-hidden rounded-xl bg-white border border-gray-100 p-8 shadow-lg transition-all duration-300"
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-red-500 rotate-45 transform translate-x-12 -translate-y-12" />
                        <div className="relative h-full flex flex-col justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="p-3 bg-blue-100 rounded-xl">
                              <User2 className="w-8 h-8 text-blue-600" />
                            </div>
                            <h2 className="text-3xl font-semibold text-gray-800">
                              {cashier.name}
                            </h2>
                          </div>
                          <div className="mt-4 text-center">
                            <p className="text-8xl font-bold text-red-500 tracking-tight transition-all duration-300 transform scale-3d">
                              Offline
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={cashier.id}
                      className="relative overflow-hidden rounded-xl bg-white border border-gray-100 p-8 shadow-lg transition-all duration-300"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 rotate-45 transform translate-x-12 -translate-y-12" />
                      <div className="relative h-full flex flex-col justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-blue-100 rounded-xl">
                            <User2 className="w-8 h-8 text-blue-600" />
                          </div>
                          <h2 className="text-3xl font-semibold text-gray-800">
                            {cashier.name}
                          </h2>
                        </div>
                        <div className="mt-4 text-center">
                          <p className="text-xl text-gray-500 mb-2">
                            Now Serving:
                          </p>
                          <p
                            className={`text-8xl font-bold text-blue-600 tracking-tight transition-all duration-300 transform
                            ${
                              animatingIds.has(cashier.id)
                                ? "scale-125 text-green-600"
                                : "scale-100"
                            }`}
                          >
                            {cashier.currentNumber}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
