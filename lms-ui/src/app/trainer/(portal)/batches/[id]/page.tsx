"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/Context/AuthContext";
import { getBatchById } from "@/Apis/Batch";
import { Loader2, ArrowLeft, Users, Calendar, BookOpen, FileText, BarChart, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NoData } from "@/components/ui/no-data";
import Header from "@/components/dashboard/Header";

export default function TrainerBatchDetailPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "overview";
  const { token, user } = useAuth();
  const router = useRouter();

  const [batch, setBatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const fetchBatchData = async () => {
      if (token && id) {
        try {
          const data = await getBatchById(id as string, token);
          setBatch(data);
        } catch (error) {
          console.error("Failed to load batch", error);
        } finally {
          setLoading(false);
        }
      }
    };
    if (token) fetchBatchData();
  }, [id, token]);

  if (loading) {
     return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
  }

  if (!batch) {
    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
             <NoData message="Batch Not Found" description="The batch you are looking for does not exist or you don't have access." />
             <Button onClick={() => router.back()}>Go Back</Button>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
        {/* Header */}
        <div className="px-4 md:px-6 xl:px-10 py-6 pb-2 shrink-0 flex items-center gap-4">
             <Button variant="ghost" size="icon" onClick={() => router.back()}>
                 <ArrowLeft size={20} />
             </Button>
             <div className="flex-1">
                 <h1 className="text-2xl font-bold tracking-tight text-foreground">{batch.title || batch.name || "Batch Details"}</h1>
                 <p className="text-muted-foreground">{batch.branch?.name || "Branch"} • {batch.code || "Code"}</p>
             </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 xl:px-10 pb-10 custom-scrollbar">
            <Tabs value={activeTab} onValueChange={(val) => {
                setActiveTab(val);
                router.replace(`/trainer/batches/${id}?tab=${val}`);
            }} className="w-full">
                <TabsList className="mb-6 w-full justify-start overflow-x-auto">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="students">Students</TabsTrigger>
                    <TabsTrigger value="attendance">Attendance</TabsTrigger>
                    <TabsTrigger value="assignments">Assignments</TabsTrigger>
                    <TabsTrigger value="exams">Exams</TabsTrigger>
                    <TabsTrigger value="results">Results</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-0">
                    <div className="p-6 border rounded-xl bg-card shadow-sm space-y-4">
                        <h3 className="text-lg font-semibold">Batch Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm text-muted-foreground block">Schedule</span>
                                <span className="font-medium">{batch.schedule || `${batch.startTime || ''} - ${batch.endTime || ''}`}</span>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground block">Type</span>
                                <span className="font-medium">{batch.type}</span>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground block">Start Date</span>
                                <span className="font-medium">{batch.startDate ? new Date(batch.startDate).toLocaleDateString() : "N/A"}</span>
                            </div>
                             <div>
                                <span className="text-sm text-muted-foreground block">End Date</span>
                                <span className="font-medium">{batch.endDate ? new Date(batch.endDate).toLocaleDateString() : "Ongoing"}</span>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="students">
                    <NoData message="Student List" description="Student management will be available here." />
                </TabsContent>

                <TabsContent value="attendance">
                    <NoData message="Attendance" description="Attendance marking interface will be available here." />
                </TabsContent>

                <TabsContent value="assignments">
                     <NoData message="Assignments" description="Assignments list will be available here." />
                </TabsContent>

                <TabsContent value="exams" className="mt-0">
                     <NoData message="Exams" description="Exams section is under construction." />
                </TabsContent>

                <TabsContent value="results" className="mt-0">
                     <NoData message="Results" description="Results section is under construction." />
                </TabsContent>
            </Tabs>
        </div>
    </div>
  );
}
