"use client";

import moment from "moment";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DateRangePickerValue } from "@tremor/react";
import { DateFilter, dateFormat } from "../types/date-filter";
import { getQueryFromSearchParams } from "@/lib/utils";

export default function useDateFilter() {
  const router = useRouter();
  const [dateRangePickerValue, setDateRangePickerValue] =
    useState<DateRangePickerValue>();
  const pathname = usePathname();
  const params = useSearchParams();

  const setDateFilter = useCallback(
    ({ from, to, selectValue }: DateRangePickerValue) => {
      const lastDays = selectValue ?? DateFilter.Custom;
      // const searchParams = new URLSearchParams(window.location.search);
      const searchParams = new URLSearchParams(params);
      searchParams.set("last_days", lastDays);

      if (lastDays === DateFilter.Custom && from && to) {
        searchParams.set("start_date", moment(from).format(dateFormat));
        searchParams.set("end_date", moment(to).format(dateFormat));
      } else {
        searchParams.delete("start_date");
        searchParams.delete("end_date");
      }
      router.push(`${pathname}${getQueryFromSearchParams(searchParams)}`);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const lastDaysParam = params.get("last_days") as DateFilter;
  const lastDays: DateFilter =
    typeof lastDaysParam === "string" &&
    Object.values(DateFilter).includes(lastDaysParam)
      ? lastDaysParam
      : DateFilter.Last7Days;

  const { from, to } = useMemo(() => {
    const today = moment().utc();
    if (lastDays === DateFilter.Custom) {
      const fromParam = params.get("start_date") as string;
      const toParam = params.get("end_date") as string;

      const from =
        fromParam ||
        moment(today)
          .subtract(+DateFilter.Last7Days, "days")
          .format(dateFormat);
      const to = toParam || moment(today).format(dateFormat);

      return { from, to };
    }

    const from = moment(today).subtract(+lastDays, "days").format(dateFormat);
    const to =
      lastDays === DateFilter.Yesterday
        ? moment(today)
            .subtract(+DateFilter.Yesterday, "days")
            .format(dateFormat)
        : moment(today).format(dateFormat);

    return { from, to };
  }, [lastDays, params]);

  useEffect(() => {
    setDateRangePickerValue({
      from: moment(from).toDate(),
      to: moment(to).toDate(),
      selectValue: lastDays === DateFilter.Custom ? null : lastDays,
    });
  }, [from, to, lastDays]);

  const onDateRangePickerValueChange = useCallback(
    ({ from, to, selectValue }: DateRangePickerValue) => {
      if (from && to) {
        setDateFilter({ from, to, selectValue });
      } else {
        setDateRangePickerValue({ from, to, selectValue });
      }
    },
    [setDateFilter],
  );

  return {
    from,
    to,
    dateRangePickerValue,
    onDateRangePickerValueChange,
  };
}
