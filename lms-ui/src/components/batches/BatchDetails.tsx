"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getBatchById } from "@/Apis/Batch";
import { useAuth } from "@/Context/AuthContext";
import { Loader2, ArrowLeft, Calendar, Users, Clock, MapPin, User, GraduationCap, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BatchDetailsProps {
    mode: "admin" | "trainer";
}

export default function BatchDetails({ mode }: BatchDetailsProps) {
    const { id } = useParams();
    const router = useRouter();
    const { token } = useAuth();
    const [batch, setBatch] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBatch = async () => {
            if (!id || !token) return;
            try {
                const data = await getBatchById(id as string, token);
                setBatch(data.data || data); // Adjust based on API structure
            } catch (error) {
                console.error("Failed to fetch batch:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBatch();
    }, [id, token]);

    if (loading) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!batch) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
                <p className="text-muted-foreground">Batch not found.</p>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    // Helper to get nested name safely
    const getName = (obj: any) => obj?.name || obj || "Unknown";

    return (
        <div className="flex flex-col gap-6 w-full animate-fade-in pb-10">
            {/* Navigation & Header */}
            <div className="flex flex-col gap-4">
                <Button 
                    variant="ghost" 
                    className="w-fit p-0 hover:bg-transparent hover:text-primary gap-2 text-muted-foreground"
                    onClick={() => router.back()}
                >
                    <ArrowLeft size={16} /> Back to Batches
                </Button>

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                             <h1 className="text-3xl font-bold tracking-tight text-foreground">{batch.title}</h1>
                             {batch.status && (
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                                    batch.status === "Active" || batch.status === "Running" 
                                    ? "bg-green-100 text-green-700 border-green-200" 
                                    : "bg-yellow-100 text-yellow-700 border-yellow-200"
                                }`}>
                                    {batch.status}
                                </span>
                             )}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin size={16} />
                            <span>{getName(batch.branch)}</span>
                        </div>
                    </div>
                    {/* Add Edit/Action Buttons here if needed */}
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{batch.students?.length || 0}</div>
                        <p className="text-xs text-muted-foreground">Enrolled</p>
                    </CardContent>
                 </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Schedule</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{batch.type}</div>
                        <p className="text-xs text-muted-foreground">
                            {batch.startTime} - {batch.endTime}
                        </p>
                    </CardContent>
                 </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Trainer</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-bold truncate">{getName(batch.trainer)}</div>
                        <p className="text-xs text-muted-foreground">Primary Instructor</p>
                    </CardContent>
                 </Card>
                 {/* Can add attendance % or other stats here */}
            </div>

            {/* Tabs for Detailed Info */}
            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:flex border-b rounded-none p-0 h-auto bg-transparent">
                    <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2">Overview</TabsTrigger>
                    <TabsTrigger value="students" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2">Students</TabsTrigger>
                    <TabsTrigger value="schedule" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2">Schedule</TabsTrigger>
                    {mode === 'trainer' && (
                        <>
                            <TabsTrigger value="attendance" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2">Attendance</TabsTrigger>
                            <TabsTrigger value="assignments" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2">Assignments</TabsTrigger>
                        </>
                    )}
                </TabsList>

                <TabsContent value="overview" className="mt-6 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                            <CardDescription>Comprehensive information about this batch.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-muted-foreground">Course Code</h4>
                                    <p className="font-medium">{batch.code || "N/A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-muted-foreground">Start Date</h4>
                                    <p className="font-medium">{batch.startDate || "N/A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-muted-foreground">End Date</h4>
                                    <p className="font-medium">{batch.endDate || "Ongoing"}</p>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                                    <p className="font-medium">{batch.description || "No description provided."}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="students" className="mt-6">
                     <Card>
                        <CardHeader>
                            <CardTitle>Enrolled Students</CardTitle>
                            <CardDescription>List of students currently in this batch.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {batch.students && batch.students.length > 0 ? (
                                <div className="space-y-4">
                                    {batch.students.map((student: any) => (
                                        <div key={student._id || student.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-lg transition-colors">
                                            <div className="flex items-center gap-3">
                                                 <Avatar>
                                                    <AvatarImage src={student.image} />
                                                    <AvatarFallback>{student.name?.charAt(0) || "S"}</AvatarFallback>
                                                 </Avatar>
                                                 <div>
                                                     <p className="font-medium leading-none">{student.name}</p>
                                                     <p className="text-sm text-muted-foreground">{student.email}</p>
                                                 </div>
                                            </div>
                                            <Button variant="ghost" size="sm">View Profile</Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-muted-foreground">No students enrolled yet.</div>
                            )}
                        </CardContent>
                     </Card>
                </TabsContent>
                
                 <TabsContent value="schedule" className="mt-6">
                     <Card>
                         <CardHeader>
                            <CardTitle>Class Schedule</CardTitle>
                         </CardHeader>
                         <CardContent>
                             <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/20">
                                 <Clock className="h-5 w-5 text-primary" />
                                 <div>
                                     <p className="font-semibold">{batch.type}</p>
                                     <p className="text-sm text-muted-foreground">{batch.startTime} - {batch.endTime}</p>
                                 </div>
                             </div>
                         </CardContent>
                     </Card>
                </TabsContent>
                
                {mode === 'trainer' && (
                    <>
                        <TabsContent value="attendance" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Attendance</CardTitle>
                                    <CardDescription>Manage daily attendance for this batch.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground bg-muted/20 rounded-lg border-2 border-dashed">
                                        <Calendar className="h-10 w-10 mb-2 opacity-20" />
                                        <p>Attendance module coming soon</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="assignments" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Assignments</CardTitle>
                                    <CardDescription>View and grade assignments.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground bg-muted/20 rounded-lg border-2 border-dashed">
                                        <FileText className="h-10 w-10 mb-2 opacity-20" /> // Ensure FileText is imported
                                        <p>Assignments module coming soon</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </>
                )}
            </Tabs>
        </div>
    );
}
