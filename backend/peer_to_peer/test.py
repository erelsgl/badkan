class Test:
    def __init__(self, test_id, test_owner, test_results):
        self.test_id = test_id
        self.test_owner = test_owner
        self.test_results = test_results # map with key :student_id, value: PASSED or FAILED.
