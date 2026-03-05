
const Typewriter = ({ text, delay = 0 }: { text: string; delay?: number }) => {
    const [displayText, setDisplayText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(150);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (delay > 0 && displayText === "" && !isDeleting) {
                // Initial delay
                setDisplayText(text.charAt(0));
                return;
            }

            if (!isDeleting && displayText.length < text.length) {
                setDisplayText(text.substring(0, displayText.length + 1));
                setTypingSpeed(100 + Math.random() * 50);
            } else if (isDeleting && displayText.length > 0) {
                setDisplayText(text.substring(0, displayText.length - 1));
                setTypingSpeed(50);
            } else if (!isDeleting && displayText.length === text.length) {
                setTimeout(() => setIsDeleting(true), 2000);
            } else if (isDeleting && displayText.length === 0) {
                setIsDeleting(false);
                setTypingSpeed(150);
            }
        }, displayText === "" && !isDeleting ? delay * 1000 : typingSpeed);

        return () => clearTimeout(timeout);
    }, [displayText, isDeleting, text, delay, typingSpeed]);

    return (
        <span className="relative inline-block">
            {displayText}
            <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className="inline-block w-[4px] h-[0.8em] bg-[#84CC16] ml-1 align-middle"
            />
        </span>
    );
};

export { Typewriter };