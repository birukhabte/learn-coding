import os
import random
import subprocess
from datetime import datetime, timedelta
import calendar

# -----------------------
# Helper functions
# -----------------------

def get_positive_int(prompt, default=20):
    while True:
        try:
            user_input = input(f"{prompt} (default {default}): ")
            if not user_input.strip():
                return default
            value = int(user_input)
            if value > 0:
                return value
            else:
                print("Please enter a positive integer.")
        except ValueError:
            print("Invalid input. Please enter a valid integer.")

def get_repo_path(prompt, default="."):
    while True:
        user_input = input(f"{prompt} (default current directory): ")
        if not user_input.strip():
            return default
        if os.path.isdir(user_input):
            return user_input
        else:
            print("Directory does not exist. Please enter a valid path.")

def get_filenames(prompt, default="data.txt"):
    user_input = input(f"{prompt} (comma-separated, default {default}): ")
    if not user_input.strip():
        return [default]
    parts = [p.strip() for p in user_input.split(',') if p.strip()]
    return parts

def get_days_list(prompt):
    """Prompt for comma-separated days or ranges (e.g. 1,3,5-7). Returns sorted list of days 1..31."""
    while True:
        user_input = input(f"{prompt} (e.g. 1,3,5-7). Press Enter for all days: ")
        if not user_input.strip():
            return list(range(1, 32))
        parts = user_input.split(',')
        days = set()
        try:
            for p in parts:
                p = p.strip()
                if '-' in p:
                    a, b = p.split('-', 1)
                    a = int(a); b = int(b)
                    if a < 1 or b > 31 or a > b:
                        raise ValueError
                    for d in range(a, b + 1):
                        days.add(d)
                else:
                    d = int(p)
                    if d < 1 or d > 31:
                        raise ValueError
                    days.add(d)
            if days:
                return sorted(days)
        except ValueError:
            print("Invalid input. Enter numbers 1-31 or ranges like 5-7, separated by commas.")

# -----------------------
# Random date in May 2025 only
# -----------------------
def get_months_list(prompt, default_months=None):
    if default_months is None:
        default_months = [4, 5, 6, 7, 8]
    while True:
        user_input = input(f"{prompt} (e.g. 4-8,4,6 or Apr-Aug,Apr,Jun). Press Enter for default April–August 2025: ")
        if not user_input.strip():
            return default_months
        parts = [p.strip() for p in user_input.split(',') if p.strip()]
        months = []
        try:
            months_map = {'jan':1,'feb':2,'mar':3,'apr':4,'may':5,'jun':6,'jul':7,'aug':8,'sep':9,'oct':10,'nov':11,'dec':12}
            def parse_month_token(tok):
                tok = tok.strip()
                if tok.isdigit():
                    return int(tok)
                key = tok.lower()[:3]
                if key in months_map:
                    return months_map[key]
                raise ValueError

            for p in parts:
                if '-' in p:
                    a_str, b_str = p.split('-', 1)
                    a = parse_month_token(a_str)
                    b = parse_month_token(b_str)
                    if a < 1 or b > 12 or a > b:
                        raise ValueError
                    for m in range(a, b + 1):
                        months.append(m)
                else:
                    m = parse_month_token(p)
                    if m < 1 or m > 12:
                        raise ValueError
                    months.append(m)
            if months:
                return sorted(set(months))
        except ValueError:
            print("Invalid month. Use numbers 1-12, ranges like 4-8, or short names like Apr or Apr-Aug.")

# -----------------------
# Random commit messages for school management project
# -----------------------
def random_commit_message():
    messages = [
        "initialize project structure","setup basic folder architecture","add README with project overview","configure gitignore file","setup development environment","install initial dependencies","create main entry file","setup routing system","implement user registration feature","implement user login functionality","add authentication middleware","setup database connection","create user model schema","add password hashing","implement logout functionality","setup error handling middleware","create dashboard layout","add navigation component","implement protected routes","setup state management","create API service layer","add form validation","implement CRUD operations","create reusable UI components","setup environment variables","optimize project structure","add logging system","implement role-based access control","create profile management feature","add update profile functionality","implement password reset feature","setup email notifications","add search functionality","implement filtering system","create pagination system","optimize API performance","add caching mechanism","setup unit testing framework","write initial test cases","implement integration tests","fix authentication bugs","refactor code for better readability","optimize database queries","add loading states","implement error UI handling","setup CI/CD pipeline","deploy initial version","fix deployment issues","add responsive design","optimize mobile view","implement dark mode feature","add accessibility improvements","create admin panel","implement admin controls","add activity logging","setup file upload feature","implement image handling","optimize file storage","add notifications system","implement real-time updates","integrate third-party API","fix UI bugs","refactor components","improve code documentation","add comments to complex logic","optimize bundle size","setup code linting","fix linting issues","implement internationalization","add multi-language support","improve security measures","setup rate limiting","fix performance bottlenecks","enhance user experience","cleanup unused code","finalize project features","prepare project for production","add final documentation","fix last-minute bugs","release version 1.0"}
    ]
    return random.choice(messages)

# -----------------------
# Commit function
# -----------------------
def make_commit(date, repo_path, filenames):
    message = random_commit_message()

    # Append the commit message line to every target file so there's a change to commit
    paths = []
    for filename in filenames:
        filepath = os.path.join(repo_path, filename)
        # create parent dirs if necessary
        parent = os.path.dirname(filepath)
        if parent and not os.path.isdir(parent):
            try:
                os.makedirs(parent, exist_ok=True)
            except Exception:
                pass
        with open(filepath, "a") as f:
            f.write(f"{date.isoformat()} - {message}\n")
        paths.append(filename)

    # Stage all files
    subprocess.run(["git", "add"] + paths, cwd=repo_path)

    env = os.environ.copy()
    date_str = date.strftime("%Y-%m-%dT%H:%M:%S")
    env["GIT_AUTHOR_DATE"] = date_str
    env["GIT_COMMITTER_DATE"] = date_str

    subprocess.run(["git", "commit", "-m", message], cwd=repo_path, env=env)

# -----------------------
# Main function
# -----------------------
def main():
    print("="*60)
    print("🌱 GitHub Contribution Graph Generator for School Project 🌱")
    print("="*60)
    
    num_commits = get_positive_int("How many commits do you want to make", 20)
    repo_path = get_repo_path("Enter the path to your local git repository", ".")
    filenames = get_filenames("Enter the filename(s) to modify for commits", "data.txt")

    print(f"\nMaking {num_commits} commits in repo: {repo_path}\nModifying files: {', '.join(filenames)}\n")
    # Ask how many commits per day we should allow (randomized)
    max_per_day = get_positive_int("Max commits per day (randomized)", 5)

    # Restrict commits to May 2025 only
    target_year = 2025
    selected_months = [5]

    # Ask which days in May 2025 to use
    selected_days = get_days_list("Enter the days in May 2025 to use")

    # Generate commit datetimes: for each selected month/day choose random number (1..max_per_day)
    commit_datetimes = []
    for month in selected_months:
        max_day = calendar.monthrange(target_year, month)[1]
        for day in selected_days:
            if day > max_day:
                continue
            count = random.randint(1, max_per_day)
            for _ in range(count):
                hour = random.randint(0, 23)
                minute = random.randint(0, 59)
                second = random.randint(0, 59)
                commit_datetimes.append(datetime(target_year, month, day, hour, minute, second))

    # Shuffle commits so they don't always go in chronological day order
    random.shuffle(commit_datetimes)

    total = len(commit_datetimes)
    print(f"\nWill make {total} commits in May {target_year}\n")
    for i, commit_date in enumerate(commit_datetimes, start=1):
        print(f"[{i}/{total}] Committing at {commit_date.strftime('%Y-%m-%d %H:%M:%S')}")
        make_commit(commit_date, repo_path, filenames)
    
    print("\nPushing commits to your remote repository...")
    subprocess.run(["git", "push"], cwd=repo_path)
    
    print("✅ Done! Check your GitHub contribution graph.\n")

# -----------------------
if __name__ == "__main__":
    main()