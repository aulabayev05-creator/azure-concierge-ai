import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConciergeChat } from "./ConciergeChat";
import { PlacesTab } from "./PlacesTab";
import { RequestsTab } from "./RequestsTab";
import { StayTab } from "./StayTab";
import { RoomTab } from "./RoomTab";

export function ConciergeWidget() {
  const [tab, setTab] = useState("chat");
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="relative h-[min(920px,calc(100dvh-6rem))] min-h-[680px] rounded-2xl overflow-hidden bg-white shadow-elegant border border-[var(--line)] flex flex-col">
      <Tabs value={tab} onValueChange={setTab} className="flex flex-col h-full">
        <div className="shrink-0">
          <div className="px-6 py-4 border-b border-[var(--line)] flex items-center justify-between">
            <div className="font-display text-lg text-[var(--navy)]">Meken AI</div>
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
        </div>
        <TabsContent value="chat" className="flex-1 m-0 overflow-hidden data-[state=active]:flex flex-col">
          <ConciergeChat onRequestCreated={() => setRefresh(r => r + 1)} />
        </TabsContent>
        <TabsContent value="places" className="flex-1 m-0 overflow-hidden"><PlacesTab /></TabsContent>
        <TabsContent value="requests" className="flex-1 m-0 overflow-hidden"><RequestsTab refreshKey={refresh} /></TabsContent>
        <TabsContent value="stay" className="flex-1 m-0 overflow-hidden"><StayTab /></TabsContent>
        <TabsContent value="room" className="flex-1 m-0 overflow-hidden"><RoomTab /></TabsContent>

        <TabsList className="shrink-0 grid grid-cols-5 h-12 rounded-none bg-white border-t border-[var(--line)] p-0">
          {[
            ["chat", "Чат"], ["places", "Места"], ["requests", "Заявки"], ["stay", "Проживание"], ["room", "Номер"],
          ].map(([v, l]) => (
            <TabsTrigger key={v} value={v}
              className="rounded-none data-[state=active]:bg-[var(--gold-soft)] data-[state=active]:text-[var(--navy)] data-[state=active]:border-t-2 data-[state=active]:border-[var(--gold)] text-xs font-medium">
              {l}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
