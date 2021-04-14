#!/usr/bin/env bash

#
# b50a25b52972a6dbf0c57f8950b4adc7
# webapp
# jq
# v1
# necu20
# 2021-04-06 01:06:03
# v4.0.0 (2019-03-05)
#
# Generated 2021-04-06 03:06:03 by dbwebb lab-utility v4.0.0 (2019-03-05).
# https://github.com/dbwebb-se/lab
#

export ANSWER
. .dbwebb.bash
echo "${PROMPT}Ready to begin."



# ==========================================================================
# jq
#
# A lab where we use jq to filter a large JSON file.
#

# --------------------------------------------------------------------------
# Section 1. jq
#
# Work with the command `jq` to filter JSON from the file tag-dbwebb.json.
#
# To answer the questions, use the following structure:
# `ANSWER = $(jq 'keys' tag-dbwebb.json)`.
#

#"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
# Exercise 1.1 (1 points)
#
# Find the `keys` of the file `tag-dbwebb.json`.
#
# Answer with the result.
#
# Write your code below and put the answer into the variable ANSWER.
#

ANSWER=$(jq 'keys' tag-dbwebb.json)

# I will now test your answer - change false to true to get a hint.
assertEqual "1.1" false

#"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
# Exercise 1.2 (1 points)
#
# What is the value of `meta.code`?
#
# `meta.code` is the status code of the HTTP request.
#
# Answer with the result.
#
# Write your code below and put the answer into the variable ANSWER.
#

ANSWER=$(jq '.meta.code' tag-dbwebb.json)

# I will now test your answer - change false to true to get a hint.
assertEqual "1.2" false

#"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
# Exercise 1.3 (1 points)
#
# The file contains a link to the next results, the so called `pagination`.
# Show the link to the paginated results (next_url).
#
# Answer with the result.
#
# Write your code below and put the answer into the variable ANSWER.
#

ANSWER=$(jq '.pagination.next_url' tag-dbwebb.json)

# I will now test your answer - change false to true to get a hint.
assertEqual "1.3" false

#"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
# Exercise 1.4 (1 points)
#
# How many likes do the 10th image have?
#
# Answer with the result.
#
# Write your code below and put the answer into the variable ANSWER.
#

ANSWER=$(jq '[.data[].likes.count][9]' tag-dbwebb.json)

# I will now test your answer - change false to true to get a hint.
assertEqual "1.4" false

#"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
# Exercise 1.5 (1 points)
#
# Which tags do the do the first image have?
# Answer with the result.
#
# Write your code below and put the answer into the variable ANSWER.
#

ANSWER=$(jq '[.data[].tags][0]' tag-dbwebb.json)

# I will now test your answer - change false to true to get a hint.
assertEqual "1.5" false

#"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
# Exercise 1.6 (1 points)
#
# Who uploaded the first image? Answer with all the information about the
# uploader.
# Answer with the result.
#
# Write your code below and put the answer into the variable ANSWER.
#

ANSWER=$(jq '[.data[].user][0]' tag-dbwebb.json)

# I will now test your answer - change false to true to get a hint.
assertEqual "1.6" false

#"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
# Exercise 1.7 (1 points)
#
# The first image is taken at a `location` with a certain `name`. What name?
#
# Answer with the result.
#
# Write your code below and put the answer into the variable ANSWER.
#

ANSWER=$(jq '[.data[].location][0].name' tag-dbwebb.json)

# I will now test your answer - change false to true to get a hint.
assertEqual "1.7" false

#"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
# Exercise 1.8 (1 points)
#
# The first image has `comments`, show the `text` for that comment.
#
# Answer with the result.
#
# Write your code below and put the answer into the variable ANSWER.
#

ANSWER=$(jq '[.data[].comments][0].data[].text' tag-dbwebb.json)

# I will now test your answer - change false to true to get a hint.
assertEqual "1.8" false

#"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
# Exercise 1.9 (1 points)
#
# The first image has several likes. Show the name of the second person who
# liked the image.
#
# Answer with the result.
#
# Write your code below and put the answer into the variable ANSWER.
#

ANSWER=$(jq '[.data[].likes][0].data[1].full_name' tag-dbwebb.json)

# I will now test your answer - change false to true to get a hint.
assertEqual "1.9" false

#"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
# Exercise 1.10 (1 points)
#
# Show the standard resolution link to the first image.
#
# Answer with the result.
#
# Write your code below and put the answer into the variable ANSWER.
#

ANSWER=$(jq '[.data[].images][0].standard_resolution.url' tag-dbwebb.json)

# I will now test your answer - change false to true to get a hint.
assertEqual "1.10" false

#"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
# Exercise 1.11 (3 points)
#
# The user alkifaey has made a comment. Use the username and show the actual
# comment (text).
#
# Answer with the result.
#
# Write your code below and put the answer into the variable ANSWER.
#

ANSWER=$(jq '.data[].comments.data[] | select(.from.username == "alkifaey").text' tag-dbwebb.json)

# I will now test your answer - change false to true to get a hint.
assertEqual "1.11" false

#"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
# Exercise 1.12 (3 points)
#
# List the links (link) to images that the user 'tobhed' have commented on.
#
# Answer with the result.
#
# Write your code below and put the answer into the variable ANSWER.
#

ANSWER=$(jq '.data[] | {link: .link, from: (.comments.data[].from | select(.username == "tobhed"))} | .link' tag-dbwebb.json)

# I will now test your answer - change false to true to get a hint.
assertEqual "1.12" false

#"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
# Exercise 1.13 (3 points)
#
# List the links to images with more than 7 likes.
#
# Answer with the result.
#
# Write your code below and put the answer into the variable ANSWER.
#

ANSWER=$(jq '.data[] | {link: .link, likes: (.likes | select(.count >7))} | .link' tag-dbwebb.json)

# I will now test your answer - change false to true to get a hint.
assertEqual "1.13" false

#"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
# Exercise 1.14 (3 points)
#
# List the links (link) of the images which has more than 5 likes and at
# least 1 comment.
#
# Answer with the result.
#
# Write your code below and put the answer into the variable ANSWER.
#

ANSWER=$(jq '.data[] | {link: .link, likes: (.likes | select(.count >5)).count, comments: (.comments | select(.count > 0)).count} | .link' tag-dbwebb.json)

# I will now test your answer - change false to true to get a hint.
assertEqual "1.14" false

#"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
# Exercise 1.15 (3 points)
#
# Find the usernames of the users, that liked the image taken at
# 'Studentviken' (location 'Studentviken').
#
# Answer with the result.
#
# Write your code below and put the answer into the variable ANSWER.
#

ANSWER=$(jq '.data[] | {username: .likes.data[].username, location: (.location | select(.name == "Studentviken"))}.username' tag-dbwebb.json)

# I will now test your answer - change false to true to get a hint.
assertEqual "1.15" false


exitWithSummary
