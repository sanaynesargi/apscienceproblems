"use client";
import { useEffect, useState } from "react";
import {
  Button,
  Group,
  Center,
  Text,
  Card,
  HStack,
  SimpleGrid,
  For,
  Stack,
  VStack,
  Link,
  Highlight,
  Box,
} from "@chakra-ui/react";
import {
  StepsCompletedContent,
  StepsContent,
  StepsItem,
  StepsList,
  StepsNextTrigger,
  StepsPrevTrigger,
  StepsRoot,
} from "@/components/ui/steps";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import axios from "axios";
import { SegmentedControl } from "@/components/ui/segmented-control";
import {
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineItem,
  TimelineRoot,
  TimelineTitle,
} from "@/components/ui/timeline";
import { LuArrowBigLeft, LuArrowLeft, LuCheck } from "react-icons/lu";
import { useRouter } from "next/navigation";

const units = {
  "Unit 1": "Chemistry of Life",
  "Unit 2": "Cell Structure and Function",
  "Unit 3": "Cellular Energetics",
  "Unit 4": "Cell Communication and Cell Cycle",
  "Unit 5": "Heredity",
  "Unit 6": "Gene Expression and Regulation",
  "Unit 7": "Natural Selection",
  "Unit 8": "Ecology",
};

const generateQuizLink = (code: string) => {
  return `https://quizizz.com/join?gc=${code}`;
};

const QuizPage = () => {
  const [quizData, setQuizData] = useState({});
  const [selectedUnit, setSelectedUnit] = useState("");
  const [value, setValue] = useState("AP Sub-Chapter Review");
  const [selectedCode, setSelectedCode] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");

  const timeline: any = [
    <TimelineItem size="lg" key={1}>
      <TimelineConnector>
        <LuCheck />
      </TimelineConnector>
      <TimelineContent>
        <TimelineTitle>Finding Quizzes</TimelineTitle>
        <TimelineDescription>Searching the web..</TimelineDescription>
        <Text textStyle="sm">
          Search Query: AP Biology Quizzes on {units[selectedUnit]} with a focus
          on {selectedTopic}
        </Text>
      </TimelineContent>
    </TimelineItem>,

    <TimelineItem size="lg" key={2}>
      <TimelineConnector>
        <LuCheck />
      </TimelineConnector>
      <TimelineContent>
        <TimelineTitle>Found Quiz</TimelineTitle>
        <TimelineDescription>Generating Link..</TimelineDescription>
        <Text textStyle="sm">Creating interactive link to quiz.</Text>
      </TimelineContent>
    </TimelineItem>,

    <TimelineItem size="lg" key={3}>
      <TimelineConnector>
        <LuCheck />
      </TimelineConnector>
      <TimelineContent>
        <TimelineTitle>Generated Link</TimelineTitle>
        <TimelineDescription>Click for your quiz!</TimelineDescription>
        <Text textStyle="sm">
          Here's the link to your quiz:{" "}
          <Link
            href={generateQuizLink(selectedCode)}
            rel="noopener noreferrer"
            target="_blank"
            color="blue.400"
          >
            Click here for your quiz!
          </Link>
        </Text>
      </TimelineContent>
    </TimelineItem>,
  ];

  const [visibleItems, setVisibleItems] = useState<number>(0);
  const [steps, setSteps] = useState(0);

  useEffect(() => {
    if (steps != 2) {
      return;
    }

    if (visibleItems < timeline.length) {
      const timer = setTimeout(() => {
        setVisibleItems((prev) => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [visibleItems, timeline.length, steps]);

  const skeletonPlaceholder = (
    <Box mb={4}>
      <Skeleton height="20px" mb={2} />
      <Skeleton height="16px" />
      <SkeletonText mt={2} noOfLines={1} spacing="4" skeletonHeight="2" />
    </Box>
  );

  const router = useRouter();

  useEffect(() => {
    const getTopicData = async () => {
      const resp = await axios.get(`http://127.0.0.1:8010/quizizz`);

      if (resp.status == 500) {
        return;
      }

      const data = resp.data;

      setQuizData(data as any);
    };

    getTopicData();
  }, []);
  return (
    <Center mt="5vh">
      <StepsRoot defaultStep={0} count={3} variant="subtle">
        <Center w="100%">
          <StepsList w={"50%"}>
            <StepsItem index={0} title="Select Unit" />
            <StepsItem index={1} title="Select Topic" />
            <StepsItem index={2} title="Get Quiz" />
          </StepsList>
        </Center>

        <Center>
          <Group>
            <Button variant="solid" size="md" onClick={() => router.push("/")}>
              <LuArrowLeft /> Home
            </Button>
            <StepsPrevTrigger asChild>
              <Button
                variant="outline"
                size="md"
                onClick={() => setSteps(steps - 1)}
              >
                Prev
              </Button>
            </StepsPrevTrigger>
            <StepsNextTrigger asChild>
              <Button
                variant="outline"
                size="md"
                onClick={() => setSteps(steps + 1)}
              >
                Next
              </Button>
            </StepsNextTrigger>
          </Group>
        </Center>

        <StepsContent index={0}>
          <Center>
            <SimpleGrid columns={[2, null, 3]} rowGap={4} columnGap={4}>
              {Object.keys(quizData)?.map((unit, index) => {
                return (
                  <Card.Root
                    width="320px"
                    key={unit}
                    variant={selectedUnit == unit ? "subtle" : "elevated"}
                    opacity={
                      selectedUnit != "" && selectedUnit != unit ? 0.5 : 1
                    }
                  >
                    <Card.Body gap="2">
                      <Card.Title mt="2">{unit}</Card.Title>
                      <Card.Description>{units[unit]}</Card.Description>
                    </Card.Body>

                    <Card.Footer justifyContent="flex-end">
                      <Button
                        onClick={() => {
                          if (selectedUnit == unit) {
                            setSelectedUnit("");
                          } else {
                            setSelectedUnit(unit);
                          }
                        }}
                        disabled={selectedUnit != "" && selectedUnit != unit}
                      >
                        {selectedUnit == unit ? "Un-Select" : "Select"}
                      </Button>
                    </Card.Footer>
                  </Card.Root>
                );
              })}
            </SimpleGrid>
          </Center>
        </StepsContent>
        <StepsContent index={1}>
          <Center>
            <VStack>
              <SegmentedControl
                value={value}
                onValueChange={(e) => setValue(e.value)}
                items={[
                  {
                    label: "AP Sub-Chapter Review",
                    value: "AP Sub-Chapter Review",
                    disabled: false,
                  },
                  {
                    label: "Topic Review",
                    value: "Topic Review",
                    disabled: false,
                  },
                  {
                    label: "Full Unit Review",
                    value: "Full Unit Review",
                    disabled: false,
                  },
                ]}
                size="lg"
                fontVariant={"lg"}
                mt="2vh"
                mb="5vh"
              />
              <SimpleGrid columns={[2, null, 3]} rowGap={4} columnGap={4}>
                {Object.keys(quizData[selectedUnit] ?? {})?.map(
                  (topic, index) => {
                    if (value.includes("AP") && !topic.includes(".")) {
                      return;
                    }
                    if (value.includes("Unit") && !topic.includes("Unit")) {
                      return;
                    }
                    if (value.includes("Topic")) {
                      if (topic.includes("Unit") || topic.includes(".")) {
                        return;
                      }
                    }

                    const code = quizData[selectedUnit][topic];

                    return (
                      <Card.Root
                        width="320px"
                        key={topic}
                        variant={
                          selectedCode != "" && selectedCode != code
                            ? "subtle"
                            : "elevated"
                        }
                        opacity={
                          selectedCode != "" && selectedCode != code ? 0.5 : 1
                        }
                      >
                        <Card.Body gap="2">
                          <Card.Title mt="2">{topic}</Card.Title>
                          <Card.Description>{}</Card.Description>
                        </Card.Body>

                        <Card.Footer justifyContent="flex-end">
                          <Button
                            onClick={() => {
                              if (selectedCode == code) {
                                setSelectedCode("");
                                setSelectedTopic("");
                              } else {
                                setSelectedCode(code);
                                setSelectedTopic(topic);
                              }
                            }}
                            disabled={
                              selectedCode != code && selectedCode != ""
                            }
                          >
                            {selectedCode == code ? "Un-Select" : "Select"}
                          </Button>
                        </Card.Footer>
                      </Card.Root>
                    );
                  }
                )}
              </SimpleGrid>
            </VStack>
          </Center>
        </StepsContent>
        <StepsContent index={2}>
          <Center>
            <TimelineRoot maxW="400px">
              {Array.from({ length: timeline.length }).map((_, index) => (
                <Box key={index} mb={4}>
                  {index < visibleItems ? timeline[index] : skeletonPlaceholder}
                </Box>
              ))}
            </TimelineRoot>
          </Center>
        </StepsContent>
        {/* <StepsCompletedContent>All steps are complete!</StepsCompletedContent> */}
      </StepsRoot>
    </Center>
  );
};

export default QuizPage;
