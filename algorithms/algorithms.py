def partition(lambda_param, num_student):
    """
    lambda_param: the number must be between 0 and 1.
    num_student: the number of students that submitted test.
    """
    circular = 1
    partition_array = []
    for i in range(num_student - 1):
        new_lambda = 2 / (num_student - i) * lambda_param
        value = new_lambda * circular
        partition_array.append(value)
        circular = circular - value
    partition_array.append(circular)
    return partition_array

print("test1")
partition_array1 = partition(0.7, 3)
print(partition_array1)
print(sum(partition_array1), "\n")

print("test2")
partition_array2 = partition(0.5, 3)
print(partition_array2)
print(sum(partition_array2), "\n")

print("test3")
partition_array3 = partition(0.2, 10)
print(partition_array3)
print(sum(partition_array3), "\n")

print("test4")
partition_array4 = partition(0.7, 100)
print(partition_array4)
print(sum(partition_array4), "\n")

print("test5")
partition_array5 = partition(1, 10)
print(partition_array5)
print(sum(partition_array5), "\n")