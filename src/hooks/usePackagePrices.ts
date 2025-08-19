import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

interface PackagePrices {
  basic: number;
  standard: number;
  premium: number;
}

const fetchPackagePrices = async (): Promise<PackagePrices> => {
  const { data } = await api.get("/public/settings/package-prices");
  return data.package_prices;
};

export const usePackagePrices = () => {
  return useQuery({
    queryKey: ["packagePrices"],
    queryFn: fetchPackagePrices,
  });
};
