class Solution:
    def __init__(self, solution_id, solution_owner, solution_results):
        self.solution_id = solution_id
        self.solution_owner = solution_owner
        self.solution_results = solution_results # map with key : test_id, value: PASSED or FAILED.
