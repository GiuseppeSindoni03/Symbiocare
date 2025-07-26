import { addDays, format } from "date-fns";
import { useMedicalDetection } from "../hooks/use-medical-detection";
import { MedicalDetectionType } from "../types/medical-detection-type";
import { useCallback, useEffect, useMemo } from "react";
import { LineChart } from "@mantine/charts";
import { Box, Space, Title } from "@mantine/core";
import styles from "../styles/medicalDetectionChart.module.css";

interface Props {
  patientId: string;
  type: MedicalDetectionType;
  startDate?: string;
  endDate?: string;
}

type DetectionLabel = {
  label: string;
  unit: string;
  color: string;
};

export function MedicalDetection({
  patientId,
  type,
  startDate = new Date().toISOString(),
  endDate = addDays(new Date(), 7).toISOString(),
}: Props) {
  const { data: detections, isLoading } = useMedicalDetection(
    patientId,
    type,
    startDate,
    endDate
  );

  const label = useCallback((type: MedicalDetectionType): DetectionLabel => {
    const labels: Record<MedicalDetectionType, DetectionLabel> = {
      HR: { label: "Battito cardiaco", unit: "bpm", color: "orange" },
      SPO2: { label: "SPO2", unit: "%", color: "red" },
      WEIGHT: { label: "Peso corporeo", unit: "kg", color: "green" },
      TEMPERATURE: { label: "Temperatura corporea", unit: "°C", color: "blue" },
      ALL: { label: "CIAOOO", unit: "", color: "black" },
    };

    return labels[type] ?? { label: "Sconosciuto", unit: "" };
  }, []);

  useEffect(() => {
    console.log(detections);
  }, [detections]);

  const chartData = useMemo(() => {
    if (!detections) return [];

    return detections.detections.map((detection) => ({
      date: format(new Date(detection.date), "dd/MM"),
      value: Number(detection.value),
      rawDate: detection.date,
    }));
  }, [detections]);

  if (
    !detections ||
    chartData.length === 0 ||
    detections.detections.length <= 0
  ) {
    {
      console.log("DIO CANE ");
    }
    return <div>Nessuna rilevazione</div>;
  }

  const {
    label: detectionLabel,
    unit: detectionUnit,
    color: detectionColor,
  } = label(detections.detections[0].type);

  console.log(`Rilevazioni ${detectionLabel}`, detections);

  return (
    <>
      <div className={styles.container}>
        <Title order={4} mt="xl" mb="sm">
          {detectionLabel}
        </Title>
        <LineChart
          h={400}
          className={styles.chart}
          data={chartData}
          dataKey="date"
          series={[
            { name: "value", label: detectionLabel, color: detectionColor },
          ]}
          curveType="linear"
          connectNulls
          unit={` ${detectionUnit}`}
          // withTooltip={true}
        />
      </div>
    </>
  );
}
