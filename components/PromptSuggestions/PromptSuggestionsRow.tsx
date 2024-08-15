import PromptSuggestionButton from "./PromptSuggestionButton";

const PromptSuggestionRow = ({ onPromptClick }) => {
  const prompts = [
    'What is EarthSupremacy Corp?',
    'Who is Victor Blackwood?',
    'How to reach out to EarthSupremacy Corp?',
    'What can I do to support the mission and values of EarthSupremacy Corp?',
  ];

  return (
    <div className="flex flex-row flex-wrap justify-start items-center py-4 gap-2">
      {prompts.map((prompt, index) => (
        <PromptSuggestionButton key={`suggestion-${index}`} text={prompt} onClick={() => onPromptClick(prompt)} />
      ))}
    </div>
  );
};

export default PromptSuggestionRow;
