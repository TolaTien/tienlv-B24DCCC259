import { useState } from "react";
import { Card, Button, Row, Col, Statistic, Typography, Tag } from "antd";

const { Title } = Typography;

const choices = [
  { label: "Kéo", icon: "✂️" },
  { label: "Búa", icon: "🔨" },
  { label: "Bao", icon: "📄" },
];

export default function KeoBuaBao() {
  const [history, setHistory] = useState([]);
  const [score, setScore] = useState({
    win: 0,
    lose: 0,
    draw: 0,
  });

  const getComputerChoice = () => {
    const randomIndex = Math.floor(Math.random() * 3);
    return choices[randomIndex];
  };

  const getResult = (player, computer) => {
    if (player === computer) return "Hòa";

    if (
      (player === "Kéo" && computer === "Bao") ||
      (player === "Búa" && computer === "Kéo") ||
      (player === "Bao" && computer === "Búa")
    ) {
      return "Thắng";
    }

    return "Thua";
  };

  const handlePlay = (playerChoice) => {
    const computerChoice = getComputerChoice();
    const result = getResult(playerChoice.label, computerChoice.label);

    const newRound = {
      player: playerChoice,
      computer: computerChoice,
      result,
    };

    setHistory([newRound, ...history]);

    if (result === "Thắng") {
      setScore({ ...score, win: score.win + 1 });
    } else if (result === "Thua") {
      setScore({ ...score, lose: score.lose + 1 });
    } else {
      setScore({ ...score, draw: score.draw + 1 });
    }
  };

  const handleReset = () => {
    setHistory([]);
    setScore({ win: 0, lose: 0, draw: 0 });
  };

  const renderResultTag = (result) => {
    if (result === "Thắng") return <Tag color="green">Thắng</Tag>;
    if (result === "Thua") return <Tag color="red">Thua</Tag>;
    return <Tag color="blue">Hòa</Tag>;
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>🎮 Trò chơi Kéo – Búa – Bao</Title>

      {/* Chọn lựa */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} justify="center">
          {choices.map((choice) => (
            <Col key={choice.label}>
              <Button
                type="primary"
                size="large"
                onClick={() => handlePlay(choice)}
              >
                {choice.icon} {choice.label}
              </Button>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Thống kê */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic title="Thắng" value={score.win} valueStyle={{ color: "green" }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Thua" value={score.lose} valueStyle={{ color: "red" }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Hòa" value={score.draw} />
          </Card>
        </Col>
      </Row>

      {/* Lịch sử */}
      <Card
        title="📜 Lịch sử trận đấu"
        extra={
          <Button danger onClick={handleReset}>
            Reset
          </Button>
        }
      >
        {history.length === 0 && <p>Chưa có trận nào.</p>}

        {history.map((round, index) => (
          <Card
            key={index}
            size="small"
            style={{ marginBottom: 12 }}
          >
            Bạn: {round.player.icon} {round.player.label} | Máy:{" "}
            {round.computer.icon} {round.computer.label} →{" "}
            {renderResultTag(round.result)}
          </Card>
        ))}
      </Card>
    </div>
  );
}