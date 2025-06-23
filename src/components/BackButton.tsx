import { ActionIcon, Tooltip } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Tooltip label="Torna indietro" position="bottom" withArrow>
        <ActionIcon
          variant="light"
          color="indigo"
          radius="xl"
          size="lg"
          onClick={() => navigate(-1)}
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            zIndex: "100",
            color: "var(--text-muted)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            transition: "transform 0.2s ease",
          }}
        >
          <IconArrowLeft size={24} />
        </ActionIcon>
      </Tooltip>
    </div>
  );
};

export default BackButton;
