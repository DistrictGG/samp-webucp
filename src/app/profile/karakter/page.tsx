"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Progress } from "~/components/ui/progress"
import { User, Wallet, Loader2} from "lucide-react"
import { api } from "~/trpc/react"

export interface Character {
    id: number
    name: string
    skin: number
    level: number
    levelup: number
    money: number
    bankmoney: number
    vip?: number // 0 = No VIP, 1 = VIP, 2 = Premium
}
  
export default function KarakterSection() {
    const { data: sampleCharacters, isLoading } = api.ucp.getCharacter.useQuery() as { data: Character[], isLoading: boolean } 
    const [selectedCharacter, setSelectedCharacter] = useState<Character | undefined>(undefined);

    useEffect(() => {
        if (sampleCharacters && sampleCharacters.length > 0) {
            setSelectedCharacter(sampleCharacters[0]);
        }
    }, [sampleCharacters]);

    if (isLoading) {
        return (
            <div className="space-y-6 flex flex-col items-center justify-center h-full">
                <Loader2 className="h-10 w-10 animate-spin"/>
            </div>
        );
    }

    if (!sampleCharacters || !selectedCharacter) {
        return <div>No characters found.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">Character Management</h1>
                <p className="text-muted-foreground">Manage and view your character information and statistics</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {sampleCharacters.map((character) => (
                    <Card key={character.id} className={`cursor-pointer transition-all hover:shadow-md ${ selectedCharacter.id === character.id ? "ring-2 ring-primary shadow-md" : "hover:shadow-sm"}`} onClick={() => setSelectedCharacter(character)}>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <Avatar className="w-16 h-16">
                                        <AvatarImage src={`https://assets.open.mp/assets/images/skins/${character.skin}.png`} alt={character.name} />
                                        <AvatarFallback className="text-lg font-semibold">
                                            {character.name.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-lg truncate">{character.name.replace("_", " ")}</h3>
                                        {selectedCharacter.id === character.id && (
                                            <Badge variant="default" className="text-xs">
                                                Active
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                        <span>Level {character.level}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <div className="grid gap-3">
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-2xl">{selectedCharacter.name.replace("_", " ")}</CardTitle>
                                        <CardDescription>Character ID: #{selectedCharacter.id}</CardDescription>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold">Level {selectedCharacter.level}</div>
                                        <div className="text-sm text-muted-foreground">{selectedCharacter.levelup}% to next level</div>
                                    </div>
                                </div>
                                <Progress value={selectedCharacter.levelup} className="mt-2" />
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-3">
                                        <h4 className="font-medium flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            Personal Information
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Full Name:</span>
                                                <span>{selectedCharacter.name.replace("_", " ")}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Character ID:</span>
                                                <span>#{selectedCharacter.id}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Vip Status:</span>
                                                <span>{selectedCharacter.vip ? "Yes" : "No"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="font-medium flex items-center gap-2">
                                            <Wallet className="w-5 h-5" />
                                            Financial
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-muted-foreground">Cash:</span>
                                                <span >${selectedCharacter.money.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-muted-foreground">Bank:</span>
                                                <span >${selectedCharacter.bankmoney.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-muted-foreground">Total:</span>
                                                <span className="font-bold text-green-600">
                                                    ${(selectedCharacter.money + selectedCharacter.bankmoney).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="activity" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            {/* <CardDescription>Your character's recent actions and events</CardDescription> */}
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 border rounded-lg">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <div className="flex-1">
                                        <div className="font-medium">Logged in</div>
                                        <div className="text-sm text-muted-foreground">2 hours ago</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 border rounded-lg">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <div className="flex-1">
                                        <div className="font-medium">Completed patrol duty</div>
                                        <div className="text-sm text-muted-foreground">3 hours ago</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 border rounded-lg">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                    <div className="flex-1">
                                        <div className="font-medium">Purchased vehicle</div>
                                        <div className="text-sm text-muted-foreground">1 day ago</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 border rounded-lg">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    <div className="flex-1">
                                        <div className="font-medium">Level up to 25</div>
                                        <div className="text-sm text-muted-foreground">2 days ago</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
