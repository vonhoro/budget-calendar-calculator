"use client";
import React from "react";

import {
  Box,
  Button,
  Collapse,
  Flex,
  Menu,
  MenuItem,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Tr,
} from "@chakra-ui/react";
import { AlertDialogCustomized } from "./AlertDialogCustomized";
import { UpdateItem } from "./updateItem";
import { DeleteItem } from "./deleteItem";

export const CalendarSquareList = ({
  Information,
  Name,
  SelectorColor,
  LettersColor,
  ColapseColor,
  MarginButtom,
  MarginTop,
  NameOnList,
  UpdateData,
  hasDetail,
}) => {
  const [selectedIndex, setSelectedIndex] = React.useState(null);
  const [openList, setOpenList] = React.useState(false);
  const [_, refresh] = React.useReducer((_) => !_);
  const updateInfo = (state, action) => {
    const { type, index, newData } = action;
    if (type === "Set up") {
      state = Information;

      return state;
    }

    return state;
  };

  const [listData, dispatchUpdateInfo] = React.useReducer(
    updateInfo,
    Information,
  );
  // const [listData, dispatch] = React.useReducer(updateInfo, []);

  React.useEffect(() => {
    setOpenList(false);
    dispatchUpdateInfo({ type: "Set up" });
  }, [Information]);

  const [openAert, setOpenAlert] = React.useState(false);
  const [openAlertLoad, setOpenAlertLoad] = React.useState(false);
  const alertRef = React.useRef();
  const onCloseAlert = () => setOpenAlert(false);
  const [alertHeader, setAlertHeader] = React.useState("");
  const [alertBody, setAlertBody] = React.useState("");
  const [alertNotes, setAlertNotes] = React.useState("");

  const alertForResult = () => (
    <AlertDialogCustomized
      isOpen={openAert}
      isLoading={openAlertLoad}
      leastDestructiveRef={alertRef}
      onClose={onCloseAlert}
      onCancel={onCloseAlert}
      onAccept={async (e) => {
        try {
          setOpenAlertLoad(true);
          onCloseAlert();

          return;
        } catch (error) {
          console.log(error);
        }
      }}
      Header={alertHeader}
      Body={alertBody}
    />
  );

  const formatingItemDescriptionsTable = (data) => {
    const component = [];

    const { _id, ...rest } = data;

    for (const keyName in rest) {
      component.push(
        (<Tr key={`${_id} ${keyName}`}>
          <Th>{keyName}</Th>
          <Th>{rest[keyName]}</Th>
        </Tr>),
      );
    }
    component.push(
      (<Tr key={`${_id}emptyspace1`}>
        <Th></Th>
        <Th></Th>
      </Tr>),
    );
    component.push(
      (<Tr key={`${_id}emptyspace2`}>
        <Th></Th>
        <Th></Th>
      </Tr>),
    );
    return component;
  };

  return (
    <>
      {alertForResult()}
      <Box
        mb={MarginButtom}
        alignSelf="center"
        sx={{ cursor: "pointer" }}
        h={`${90 / 20}vh`}
        w={`${(90 / 7) * 0.95}vw`}
        bg={SelectorColor}
        onClick={() => setOpenList(!openList)}
      >
        <Text
          fontSize="lg"
          textAlign="center"
          color={LettersColor}
          fontWeight="bold"
        >
          {Name}
        </Text>
      </Box>
      <Collapse in={openList} animateOpacity unmountOnExit>
        <Box
          alignSelf="center"
          w={`${(90 / 7) * 0.95}vw`}
          ml={`${(90 / 7) * 0.02}vw`}
          bg={ColapseColor}
          alignContent="center"
        >
          {listData?.map((data, index) => {
            if (!hasDetail) {
              return (
                <Box ml="1em" pt=".5em" pb=".5em" key={index.toString()}>
                  <Text
                    fontSize="md"
                    textAlign="left"
                    fontWeight="bold"
                    color="black"
                  >
                    {`${NameOnList["prevText"][index]}${
                      data[NameOnList["keyToUse"]]
                    }`}
                  </Text>
                </Box>
              );
            }

            return (
              <Popover
                isLazy={true}
                placement="right"
                closeOnBlur={false}
                key={index.toString()}
              >
                <PopoverTrigger>
                  <Box ml="1em" pt=".5em" pb=".5em">
                    <Text
                      fontSize="md"
                      textAlign="left"
                      fontWeight="bold"
                      color="black"
                      sx={{ cursor: "pointer" }}
                    >
                      {`${NameOnList["prevText"][index]}${
                        data[NameOnList["keyToUse"]]
                      }`}
                    </Text>
                  </Box>
                </PopoverTrigger>
                <PopoverContent
                  color="white"
                  bg="blue.900"
                  borderColor="purple.100"
                >
                  <PopoverHeader
                    pt={4}
                    fontWeight="bold"
                    textAlign="center"
                    border="0"
                  >
                    Details
                  </PopoverHeader>
                  <PopoverArrow bg="purple.700" />
                  <PopoverCloseButton />
                  <PopoverBody>
                    <TableContainer>
                      <Table size="sm" variant="unstyled">
                        <Tbody>
                          {formatingItemDescriptionsTable(data)}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </PopoverBody>

                  <PopoverFooter>
                    <Flex direction="column" justify="center" w="100%">
                      <Flex align="center" justify="space-around">
                        <UpdateItem
                          Data={data}
                          index={index}
                          updateInfo={UpdateData}
                        />
                        <DeleteItem
                          id={data["_id"]}
                          date={data["date"]}
                          removeItem={UpdateData}
                        />
                      </Flex>
                    </Flex>
                  </PopoverFooter>
                </PopoverContent>
              </Popover>
            );
          })}
        </Box>
      </Collapse>
    </>
  );
};
