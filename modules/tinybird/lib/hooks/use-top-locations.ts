import useSWR from "swr";
import { queryPipe } from "../api";
import {
  TopLocation,
  TopLocationsData,
  TopLocationsSorting,
} from "../types/top-locations";
import useDateFilter from "./use-date-filter";
import useParams from "./use-params";
import { getStatus } from "./use-query";

function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

async function getTopLocations(
  sorting: TopLocationsSorting,
  date_from?: string,
  date_to?: string,
  domain?: string,
) {
  const { data: queryData } = await queryPipe<TopLocationsData>(
    "top_locations",
    { limit: 8, date_from, date_to, domain },
  );
  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

  const data: TopLocation[] = [...queryData]
    .sort((a, b) => b[sorting] - a[sorting])
    .map(({ location, ...rest }) => {
      const unknownLocation = "🌎  Unknown";
      return {
        location: location
          ? `${getFlagEmoji(location)} ${regionNames.of(location)}`
          : unknownLocation,
        shortLocation: location
          ? `${getFlagEmoji(location)} ${location}`
          : unknownLocation,
        ...rest,
      };
    });

  const locations = data.map(({ location }) => location);
  const labels = data.map((record) => record[sorting]);

  return {
    data,
    locations,
    labels,
  };
}

export default function useTopLocations(domain: string) {
  const { from, to } = useDateFilter();
  const [sorting] = useParams({
    key: "top_locations_sorting",
    defaultValue: TopLocationsSorting.Visitors,
    values: Object.values(TopLocationsSorting),
  });
  // const query = useQuery(
  //   [sorting, from, to, domain, "topLocations"],
  //   getTopLocations,
  // );
  const query = useSWR("topLocations", () =>
    getTopLocations(sorting, from, to, domain),
  );
  return {
    warning: query.error,
    status: getStatus(
      query.data,
      query.error,
      query.isValidating,
      query.isLoading,
    ),
    ...query,
  };
}
