import static org.junit.Assert.*;

import org.junit.Test;

public class TestCases {

	@Test
	public void test() {
		int exp1 = MyClass1.myFun1(3, 5);
		assertEquals(exp1, 3 * 5);
	}

	@Test
	public void test2() {
		int exp1 = MyClass1.myFun2(3, 5);
		assertEquals(exp1, 3 + 5);
	}

	@Test
	public void test3() {
		int exp1 = MyClass1.myFun3(3, 5);
		assertEquals(exp1, 3 - 5);
	}

	@Test
	public void test4() {
		int exp1 = MyClass3.myFun5(3, 5);
		assertEquals(exp1, 3 * 5);
	}

	@Test
	public void test5() {
		int exp1 = MyClass3.myFun7(3, 5);
		assertEquals(exp1, 3 + 5);
	}

	@Test
	public void test6() {
		int exp1 = MyClass2.myFun6(3, 5);
		assertEquals(exp1, 3 * 5);
	}

}
