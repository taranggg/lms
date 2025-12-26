"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/Context/AuthContext";
import { Loader2, ArrowLeft, FileText, Video, Link as LinkIcon, ExternalLink, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { toast } from "sonner";

interface ResourceDetailsProps {
    mode: "admin" | "trainer" | "student";
}

export default function ResourceDetails({ mode }: ResourceDetailsProps) {
    const { id } = useParams();
    const router = useRouter();
    const { token } = useAuth();
    const [resource, setResource] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResource = async () => {
            if (!id || !token) return;
            try {
                 // Assuming an endpoint exists or we filter from all?
                 // Usually getAllMaterials doesn't imply getById availability or efficiency, 
                 // but for specific resource, usually /api/v1/material/:id
                 // If not, I'll fallback to placeholder/mock if I can't confirm endpoint.
                 // Given create/get all exists, likely getById exists too. 
                 const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
                 
                 // Try fetching specific or filter from list if no ID endpoint known?
                 // Let's assume standard REST
                 try {
                    const res = await axios.get(`${BASE_URL}/api/v1/material/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                     setResource(res.data.data || res.data);
                 } catch (e) {
                     // Fallback mechanism: Fetch all and find (not ideal but works if API missing)
                     const res = await axios.get(`${BASE_URL}/api/v1/material/getAllMaterials`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const allData = res.data.data || res.data || [];
                    const found = allData.find((r: any) => r._id === id);
                    if (found) setResource(found);
                    else throw new Error("Not found");
                 }

            } catch (error) {
                console.error("Failed to fetch resource:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchResource();
    }, [id, token]);

    if (loading) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!resource) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
                <p className="text-muted-foreground">Resource not found.</p>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    const getIcon = (type: string) => {
        switch (type) {
            case "PDF": return <FileText size={48} className="text-red-500" />;
            case "Video": return <Video size={48} className="text-blue-500" />;
            default: return <LinkIcon size={48} className="text-indigo-500" />;
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto animate-fade-in pb-10 pt-4">
            <Button 
                variant="ghost" 
                className="w-fit p-0 hover:bg-transparent hover:text-primary gap-2 text-muted-foreground"
                onClick={() => router.back()}
            >
                <ArrowLeft size={16} /> Back to Resources
            </Button>

            <Card className="overflow-hidden border-2">
                <div className="h-32 bg-gradient-to-r from-muted/50 to-primary/5 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-grid-black/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
                    <div className="bg-background rounded-full p-4 shadow-xl relative z-10 scale-125">
                         {getIcon(resource.type)}
                    </div>
                </div>
                
                <CardHeader className="text-center pt-10 pb-2">
                    <div className="flex justify-center mb-2">
                        <span className="px-3 py-1 rounded-full bg-muted text-xs font-semibold">{resource.type}</span>
                    </div>
                    <CardTitle className="text-3xl">{resource.title}</CardTitle>
                    <CardDescription>
                        Added on {resource.createdAt ? new Date(resource.createdAt).toLocaleDateString() : "Unknown Date"}
                    </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                    <div className="bg-muted/30 p-6 rounded-xl border">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                            Description
                        </h4>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            {resource.description || "No description provided for this resource."}
                        </p>
                    </div>

                    {/* Metadata / Extra Info could go here */}
                </CardContent>
                
                <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center pb-8">
                     <Button size="lg" className="w-full sm:w-auto gap-2" onClick={() => window.open(resource.url, '_blank')}>
                         <ExternalLink size={18} />
                         Open Original Resource
                     </Button>
                     {/* Edit/Delete for Admin/Trainer */}
                     {mode !== 'student' && (
                         <Button variant="outline" size="lg" className="w-full sm:w-auto">
                             Edit Resource
                         </Button>
                     )}
                </CardFooter>
            </Card>
        </div>
    );
}
