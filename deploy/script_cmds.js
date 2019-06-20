// check only modified (-z tests if the string is null or empty)
// [[ -z $(git diff --stat) ]] || echo dirty
// [[ -n $(git diff --stat) ]] || echo clean
exports.when_git_dirty = '[[ -z $(git diff --stat) ]]';
exports.when_git_clean = '[[ -n $(git diff --stat) ]]';
// check modified and untracked
exports.when_git_dirty_all = '[[ -z $(git status -s) ]]';
exports.when_git_clean_all = '[[ -n $(git status -s) ]]';
// git commit
exports.git_checkout_release = 'git checkout release';
exports.git_add_all_and_commit = 'git add -A; git commit -m "by nwas-deploy"';

// git reset
exports.git_soft_reset_last = 'git reset --soft HEAD~1';
exports.git_hard_reset_last = 'git reset --hard HEAD~1';
