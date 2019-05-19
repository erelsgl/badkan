import static org.junit.Assert.*;

import org.junit.Test;

public class testCases1 {

	@Test
	public void test() {
		Signature.add();
		//add();
		fail("Not yet implemented");
	}

	@Test
	public void test2() {

		// Making a compiling error.
		Signature.add();
		//Integer.parseInt("hello");
		//add();
		fail("Not yet implemented");
	}

	@Test
	public void trueTest() {
		int expected = Signature.multiply(2, 4);
		assertTrue(expected == 8 * 4);
	}

	@Test
	public void testWithExp() {
		double actual = Signature.multiply(2, 4);
		double expected = 8 * 4;
		assertEquals(actual, actual);
	}

}
