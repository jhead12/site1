import { useChain } from "@account-kit/react";
import { base, baseSepolia, optimism, polygon } from "viem/chains";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const chainConfigs = [
  { chain: base, name: "Base", gradient: "from-blue-400 to-blue-600" },
  { chain: optimism, name: "Optimism", gradient: "from-red-400 to-red-600" },
  { chain: baseSepolia, name: "Base Sepolia", gradient: "from-blue-300 to-purple-400" },
  { chain: polygon, name: "Polygon", gradient: "from-purple-400 to-purple-600" },
];

export function ChainSelector() {
  const { chain: currentChain, setChain, isSettingChain } = useChain();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex gap-2 items-center transition-all hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-blue-500"
        >
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
          <span>{chainConfigs.find((c) => c.chain.id === currentChain.id)?.name || currentChain.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="animate-in fade-in-80 slide-in-from-top-5">
        <DropdownMenuLabel className="font-semibold text-sm text-gray-500 dark:text-gray-400">
          Switch Network
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {chainConfigs.map(({ chain, name, gradient }) => (
          <DropdownMenuItem
            key={chain.id}
            onClick={() => setChain({ chain })}
            disabled={isSettingChain}
            className="flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div className={`w-4 h-4 mr-2 rounded-full bg-gradient-to-r ${gradient}`} />
            {name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}