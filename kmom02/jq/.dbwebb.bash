#!/usr/bin/env bash
#
# Bash dbwebb module for asserting and auto correcting labs.
#
# It reads the answers from files in a directory
# for checking with assertEqual().
#
ANSWERS=".answer"
PROMPT=">>> "
NOANSWER="Replace this text with the variable holding the answer."
ANSWER="$NOANSWER"



#
# Init by reading file with answers.
#
LAB_answers=$( cat "$ANSWERS/summary.total" )
LAB_correct=0
LAB_failed=0
LAB_notDone=0

LAB_mypoints=0
LAB_points=$LAB_answers
if [ -f "$ANSWERS/summary.points" ]; then
    LAB_points=$( cat "$ANSWERS/summary.points" )
fi

LAB_pass=$LAB_points
if [ -f "$ANSWERS/summary.pass" ]; then
    LAB_pass=$( cat "$ANSWERS/summary.pass" )
fi

LAB_distinct=-1 # -1 to disable
if [ -f "$ANSWERS/summary.passdistinct" ]; then
    LAB_distinct=$( cat "$ANSWERS/summary.passdistinct" )
fi



#
# Assert if equal with expected answer.
# Check if the answer is correct or not, present a hint if asked for.
#
# question, answer, hint
#
function assertEqual
{
    local question=$1
    local hint=$2
    local theAnswer="$ANSWER"
    local answer
    local points=1

    answer=$( cat "$ANSWERS/$question" )

    if [ -f "$ANSWERS/$question.points" ]; then
        points=$( cat "$ANSWERS/$question.points" )
    fi

    if [ "$theAnswer" = "$NOANSWER" ]; then
        echo "${PROMPT}$question NOT YET DONE. (${points}p)"
        ((LAB_notDone++))
    elif [ "$theAnswer" = "$answer" ]; then
        printf "%s%s CORRECT. Well done! (%sp)\n" "$PROMPT" "$question" "$points"
        ((LAB_correct++))
        LAB_mypoints=$((LAB_mypoints + points))
    else
        printf "%s%s FAIL. (%sp)\n%sYou said:\n%s\n" "$PROMPT" "$question" "$points" "$PROMPT" "$theAnswer"
        if $hint; then
            printf "%sHint:\n%s\n" "$PROMPT" "$answer"
        fi
        ((LAB_failed++))
    fi
    
    ANSWER="$NOANSWER"
}



#
# Exit with a summary.
# Print a exit message with the result of all tests.
# Exit with status 0 if all tasks are solved, else exit with status 1.
#
function exitWithSummary
{
    printf "%sDone with status %d/%d/%d/%d (Total/Correct/Failed/Not done).\n" "$PROMPT" "$LAB_answers" "$LAB_correct" "$LAB_failed" "$LAB_notDone"
    
    printf "%sPoints earned: %sp of %sp (PASS=>%sp" "$PROMPT" "$LAB_mypoints" "$LAB_points" "$LAB_pass"
    if [ "$LAB_distinct" -ne -1 ]; then
        printf ", PASS W DISTINCTION=>%sp" "$LAB_distinct"
    fi
    printf ").\n"

    # Grading
    if [ "$LAB_distinct" -ne -1 ] && [ "$LAB_mypoints" -ge "$LAB_distinct" ]; then
        printf "\e[0;36m%sGrade: PASS WITH DISTINCTION!!! :-D\e[m\n" "$PROMPT"
    elif [ "$LAB_mypoints" -ge "$LAB_pass" ]; then
        printf "\e[0;32m%sGrade: PASS! :-)\e[m\n" "$PROMPT"
    else
        printf "\e[1;33m%sGrade: Thou Did Not Pass. :-|\e[m\n" "$PROMPT"
    fi

    exit $(( LAB_mypoints >= LAB_pass ? 0 : 42 ))
}



#
# Execute SQL query towards SQLite database and save response in ANSWER.
#
function SQL
{
    ANSWER=$( sqlite3 -header -column db.sqlite "$1" 2>&1 | sed 's/[[:blank:]]*$//' )

    if [ "$2" = true ]; then
        echo "SQL> $1"
        echo "$ANSWER"
    fi
}



#
# Check for command, abort if not exists.
#
function checkCommandOrAbort
{
    if ! hash "$1" 2> /dev/null; then
        printf "\e[1;33mFAILED: I require %s but it's not installed. Aborting.\e[m\n" "$1"
        exit 1;
    fi
}
