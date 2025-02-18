"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@uidotdev/usehooks";
import { User2, Plus, Power, UserCheck, Hash } from "lucide-react";

export default function Admin() {
  const [cashiers, setCashiers] = useState([]);
  const [newCashierName, setNewCashierName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCashiers();
  }, []);

  const fetchCashiers = async () => {
    try {
      const res = await fetch("/api/queue");
      const data = await res.json();
      setCashiers(data.cashiers);
    } catch (err) {
      setError("Failed to load cashiers");
      console.error(err);
    }
  };

  const addCashier = async () => {
    if (!newCashierName) return;
    setIsLoading(true);
    setError(null);
    try {
      await fetch("/api/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "addCashier", name: newCashierName }),
      });
      setNewCashierName("");
      await fetchCashiers();
    } catch (err) {
      setError("Failed to add cashier");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 lg:p-8">
      <Card className="max-w-5xl mx-auto shadow-xl">
        <CardHeader className="border-b bg-white space-y-4 py-8">
          <div className="flex items-center justify-center space-x-4">
            <h1 className="text-4xl font-bold text-gray-800">
              Queue Admin Panel
            </h1>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          </div>
          <p className="text-center text-gray-500">Manage your queue system</p>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          {/* Add Cashier Section */}
          <div className="bg-blue-50 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">
              Add New Cashier
            </h2>
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Input
                  value={newCashierName}
                  onChange={(e) => setNewCashierName(e.target.value)}
                  placeholder="Enter cashier name"
                  className="pl-10 h-12 text-lg"
                />
                <User2 className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <Button
                onClick={addCashier}
                disabled={isLoading || !newCashierName}
                className="h-12 px-6 space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Cashier</span>
              </Button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          {/* Cashiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {cashiers.map((cashier) => (
              <div
                key={cashier.id}
                className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <UserCheck className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {cashier.name}
                      </h3>
                      <p className="text-sm text-gray-500">ID: {cashier.id}</p>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm ${
                      cashier.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {cashier.isActive ? "Active" : "Inactive"}
                  </div>
                </div>

                <div className="flex items-center space-x-4 mt-4 pt-4 border-t">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Current Number</p>
                    <div className="flex items-center space-x-2">
                      <Hash className="w-5 h-5 text-blue-600" />
                      <span className="text-2xl font-bold text-blue-600">
                        {cashier.currentNumber}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="space-x-2"
                    onClick={() => {
                      /* Add toggle active state handler */
                    }}
                  >
                    <Power className="w-4 h-4" />
                    <span>{cashier.isActive ? "Deactivate" : "Activate"}</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
