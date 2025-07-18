"use client"

import { useMemo, useCallback, useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Progress } from "~/components/ui/progress"
import { User, Wallet } from "lucide-react"
import { Skeleton } from "~/components/ui/skeleton"
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
    const { data: sampleCharacters, isLoading, isError, refetch } = api.ucp.getCharacter.useQuery();
    const [selectedCharacterId, setSelectedCharacterId] = useState<number | undefined>(undefined);

    const characterList = useMemo(() => sampleCharacters ?? [], [sampleCharacters]);

    const selectedCharacter = useMemo(
        () => characterList.find(c => c.id === selectedCharacterId) ?? characterList[0],
        [characterList, selectedCharacterId]
    );

    const handleSelectCharacter = useCallback((id: number) => {
        setSelectedCharacterId(id);
    }, []);

    useEffect(() => {
        if (sampleCharacters && sampleCharacters.length > 0) {
            setSelectedCharacterId(sampleCharacters[0]?.id);
        }
    }, [sampleCharacters]);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="space-y-1">
                    <Skeleton className="h-8 w-60 rounded" />
                    <Skeleton className="h-5 w-80 rounded" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    {[1, 2].map((i) => (
                        <Card key={i} className="cursor-pointer">
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-4">
                                    <Skeleton className="w-16 h-16 rounded-full" />
                                    <div className="flex-1 min-w-0">
                                        <Skeleton className="h-6 w-32 mb-2 rounded" />
                                        <Skeleton className="h-4 w-20 rounded" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="grid gap-3">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Skeleton className="h-7 w-40 mb-2 rounded" />
                                    <Skeleton className="h-4 w-32 rounded" />
                                </div>
                                <div className="text-right">
                                    <Skeleton className="h-7 w-24 mb-2 rounded" />
                                    <Skeleton className="h-4 w-28 rounded" />
                                </div>
                            </div>
                            <Skeleton className="h-3 w-full mt-2 rounded" />
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-3">
                                    <Skeleton className="h-5 w-36 mb-2 rounded" />
                                    <div className="space-y-2 text-sm">
                                        <Skeleton className="h-4 w-32 mb-1 rounded" />
                                        <Skeleton className="h-4 w-28 mb-1 rounded" />
                                        <Skeleton className="h-4 w-24 rounded" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Skeleton className="h-5 w-28 mb-2 rounded" />
                                    <div className="space-y-2 text-sm">
                                        <Skeleton className="h-4 w-24 mb-1 rounded" />
                                        <Skeleton className="h-4 w-24 mb-1 rounded" />
                                        <Skeleton className="h-4 w-28 rounded" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (isError) {
        return <div>Gagal memuat data karakter. <button onClick={() => refetch()}>Coba Lagi</button></div>
    }

    if (!sampleCharacters || !selectedCharacter) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
                <div className="max-w-md w-full">
                    <Card className="flex flex-col items-center p-10 bg-white/70 dark:bg-background/70 shadow-xl border border-border rounded-2xl">
                        <div className="mb-6">
                            <User className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div className="text-2xl font-bold mb-2 text-center text-primary">Belum Ada Karakter</div>
                        <div className="text-muted-foreground text-center mb-6">Anda belum membuat karakter. Mulailah petualangan Anda dengan membuat karakter pertama!</div>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">Manajemen Karakter</h1>
                <p className="text-muted-foreground">Kelola dan lihat informasi serta statistik karakter Anda</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {characterList.map((character) => (
                    <Card key={character.id} className={`cursor-pointer transition-all hover:shadow-md ${ selectedCharacter.id === character.id ? "ring-2 ring-primary shadow-md" : "hover:shadow-sm"}`} onClick={() => handleSelectCharacter(character.id)}>
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
                                                Aktif
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

            {/* <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>
{/*  */}
                {/* <TabsContent value="overview" className="space-y-6"> */}
                    <div className="grid gap-3">
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-2xl">{selectedCharacter.name.replace("_", " ")}</CardTitle>
                                        <CardDescription>ID Karakter: #{selectedCharacter.id}</CardDescription>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold">Level {selectedCharacter.level}</div>
                                        <div className="text-sm text-muted-foreground">{selectedCharacter.levelup}% menuju level berikutnya</div>
                                    </div>
                                </div>
                                <Progress value={selectedCharacter.levelup} className="mt-2" />
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-3">
                                        <h4 className="font-medium flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            Informasi Pribadi
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Nama Lengkap:</span>
                                                <span>{selectedCharacter.name.replace("_", " ")}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">ID Karakter:</span>
                                                <span>#{selectedCharacter.id}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Status VIP:</span>
                                                <span>{selectedCharacter.vip ? "Ya" : "Tidak"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="font-medium flex items-center gap-2">
                                            <Wallet className="w-5 h-5" />
                                            Keuangan
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-muted-foreground">Uang Tunai:</span>
                                                <span >Rp{(selectedCharacter.money ?? 0).toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-muted-foreground">Bank:</span>
                                                <span >Rp{(selectedCharacter.bankmoney ?? 0).toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-green-600">Total:</span>
                                                <span className="font-bold text-green-600">
                                                    Rp{((selectedCharacter.money ?? 0) + (selectedCharacter.bankmoney ?? 0)).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                {/* </TabsContent> */}

                {/* <TabsContent value="activity" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
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
                </TabsContent> */}
            {/* </Tabs> */}
        </div>
    );
}
