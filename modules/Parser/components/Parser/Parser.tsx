import StepsProvider from "../../provider/Stepper.provider";
import ParserStepper from "../ParserStepper";
const Parser = () => {
  return (
    <>
      <StepsProvider>
        <ParserStepper></ParserStepper>
      </StepsProvider>
    </>
  );
};
export default Parser;
