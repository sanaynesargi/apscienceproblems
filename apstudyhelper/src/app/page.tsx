"use client";

import { Button } from "@/components/ui/button";
import { CheckboxCard } from "@/components/ui/checkbox-card";
import axios from "axios";
import {
  Flex,
  Box,
  Text,
  VStack,
  HStack,
  Grid,
  GridItem,
  DialogActionTrigger,
  DialogFooter,
  Center,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  NativeSelectField,
  NativeSelectRoot,
} from "@/components/ui/native-select";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Prose } from "@/components/ui/prose";
import { MathJaxContext, MathJax } from "better-react-mathjax";

function formatAnswerText(answerText) {
  return answerText;
}

const mathJaxConfig = {
  loader: { load: ["input/tex", "output/chtml"] },
  tex: {
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
    macros: {},
  },
  svg: {
    fontCache: "global",
  },
};

const QuestionArea = ({ open, setOpen, title, initalData, mode }) => {
  const totalQuestions = initalData.length;
  const [questionId, setQuestionId] = useState(0);
  const [answerShown, setAnswerShown] = useState(false);

  console.log(initalData[questionId]?.html);
  console.log("\n\n");

  return (
    <MathJaxContext version={3} config={mathJaxConfig}>
      <DialogRoot
        lazyMount
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
        size="cover"
        scrollBehavior="inside"
      >
        {/* <DialogTrigger asChild>
        <Button variant="outline">Open</Button>
      </DialogTrigger> */}

        <DialogContent w="100%">
          <DialogHeader>
            <DialogTitle>
              {title} - {mode.toUpperCase()} Questions
            </DialogTitle>
            <DialogCloseTrigger />
          </DialogHeader>
          <DialogBody w="100%">
            <Center>
              <HStack>
                <Prose w="100%" h="100%" mb="auto">
                  <div>
                    {/* Add styles specifically for images */}
                    <style>
                      {`
                        img {
                            max-width: 100%;
                            height: auto;
                            display: block;
                            margin: 10px 0;
                            border: 1px solid #ddd;
                            border-radius: 5px;
                            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                            background: white;
                        }
                        `}
                    </style>
                    {/* Insert HTML content */}
                    <MathJax>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: initalData[questionId]?.html,
                        }}
                      />
                    </MathJax>
                  </div>
                </Prose>
                <VStack mb="auto" alignItems="start" mt={4} ml={44}>
                  <CheckboxCard
                    label="Show Correct Answer"
                    description={
                      answerShown ? (
                        <Prose w="100%" h="100%">
                          <MathJax>
                            {initalData[questionId]
                              ? formatAnswerText(initalData[questionId]?.answer)
                              : ""}
                          </MathJax>
                        </Prose>
                      ) : (
                        "Whenever you're ready... click"
                      )
                    }
                    maxW="500px"
                    onChange={() => setAnswerShown(!answerShown)}
                  />
                </VStack>
              </HStack>
            </Center>
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button
                variant="subtle"
                colorPalette="teal"
                size="lg"
                disabled={questionId - 1 < 0}
                onClick={() => {
                  setAnswerShown(false);
                  setQuestionId(questionId - 1);
                }}
              >
                Previous
              </Button>
            </DialogActionTrigger>
            <DialogActionTrigger asChild>
              <Button
                variant="subtle"
                colorPalette="teal"
                size="lg"
                disabled={questionId + 1 == totalQuestions}
                onClick={() => {
                  setAnswerShown(false);
                  setQuestionId(questionId + 1);
                }}
              >
                Next
              </Button>
            </DialogActionTrigger>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </MathJaxContext>
  );
};

const TopicContainer = ({ topicName, href, mode }: any) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<any>([]);

  return (
    <Button
      w={"250px"}
      h={"250px"}
      border="1px"
      borderColor="gray.300"
      borderRadius="lg"
      boxShadow="md"
      display="flex"
      justifyContent="center"
      alignItems="center"
      transition="all 0.3s ease"
      onClick={async () => {
        const resp = await axios.post("http://127.0.0.1:8010/topic", {
          url: href,
        });
        if (resp.status == 500) {
          return;
        }
        const data = resp.data;

        setOpen(true);
        setData(data);
      }}
      variant={"outline"}
      colorPalette={"blue"}
      overflow="hidden" // Prevents overflow
    >
      <VStack align="center" justify="center" h="100%" w="100%">
        <Text fontSize="xl" fontWeight="bold" textAlign="center" truncate>
          {topicName.split(" ")[0]}
        </Text>
        <Text fontSize="xs" textAlign="center" truncate>
          {topicName.split(" ").slice(1).join(" ")}
        </Text>

        <QuestionArea
          open={open}
          setOpen={setOpen}
          title={topicName}
          initalData={data}
          mode={mode}
        />
      </VStack>
    </Button>
  );
};

export default function MyComponent() {
  const [selectedChapter, setSelectedChapter] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState("biology");
  const [mode, setMode] = useState("mcq");
  const [topics, setTopics] = useState([]);
  const [mapIndices, setMapIndices] = useState<any>({});

  useEffect(() => {
    if (topics.length == 0) {
      return;
    }

    let obj: any = {};
    obj["mcq-frq"] = {};
    let units = (topics.length - 2) / 2;

    for (let i = 0; i < units; i++) {
      obj["mcq-frq"][i] = i + (units - 1) + 3;
    }

    setMapIndices(obj);
  }, [topics]);

  useEffect(() => {
    const getTopicData = async () => {
      const resp = await axios.get(
        `http://127.0.0.1:8010/all_units?mode=${selectedSubject}`
      );

      if (resp.status == 500) {
        return;
      }

      const data = resp.data;

      setTopics(data as any);
    };

    getTopicData();
  }, [selectedSubject]);

  return (
    <>
      {/* Navbar */}
      <Box bg="blue.500" color="white" p={4}>
        <HStack gap={4}>
          <NativeSelectRoot maxW="150px">
            <NativeSelectField
              onChange={(e) => {
                setSelectedSubject(e.target.value);
              }}
            >
              <option value="biology">Biology</option>
              <option value="chemistry">Chemistry</option>
            </NativeSelectField>
          </NativeSelectRoot>

          <NativeSelectRoot maxW="150px">
            <NativeSelectField
              onChange={(e) => {
                if (mode == "mcq") {
                  if (e.target.value == "frq") {
                    console.log(
                      e.target.value,
                      selectedChapter,
                      mapIndices["mcq-frq"][selectedChapter]
                    );
                    setSelectedChapter(mapIndices["mcq-frq"][selectedChapter]);
                  }
                }
                if (mode == "frq") {
                  if (e.target.value == "mcq") {
                    console.log(
                      (topics.length - 2) / 2 - 1,
                      selectedChapter - 3,
                      selectedChapter - 3 - ((topics.length - 2) / 2 - 1),
                      topics[
                        selectedChapter - 3 - ((topics.length - 2) / 2 - 1)
                      ]
                    );
                    setSelectedChapter(
                      selectedChapter - 3 - ((topics.length - 2) / 2 - 1)
                    );
                  }
                }
                setMode(e.target.value);
              }}
            >
              <option value="mcq">MCQ</option>
              <option value="frq">FRQ</option>
            </NativeSelectField>
          </NativeSelectRoot>

          <NativeSelectRoot maxW="350px">
            <NativeSelectField
              onChange={(e) => {
                console.log(mode);
                setSelectedChapter(
                  mode == "mcq"
                    ? parseInt(e.target.value)
                    : mapIndices["mcq-frq"][e.target.value]
                );
              }}
            >
              {topics.map((e, i) => {
                if (!e.p_content.includes("Unit")) {
                  return;
                }

                if (i > (topics.length - 2) / 2) {
                  return;
                }

                return (
                  <option key={i} value={i}>
                    {e.p_content}
                  </option>
                );
              })}
            </NativeSelectField>
          </NativeSelectRoot>
        </HStack>
      </Box>

      {/* Main Grid */}
      <Grid
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(5, 1fr)"
        w="100vw"
        h="100vh"
        p={4}
        mt={4}
        key={Math.random()}
      >
        {topics[selectedChapter]?.li_links?.map((e, i) => {
          // Filter topics based on mode and selected chapter
          if (!e.href.includes(mode)) {
            return;
          }

          return (
            <GridItem key={i} colSpan={1}>
              <TopicContainer
                key={i}
                topicName={e.text}
                href={e.href}
                mode={mode}
              />
            </GridItem>
          );
        })}
      </Grid>
    </>
  );
}
